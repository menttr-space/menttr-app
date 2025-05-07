import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ProgramsSearchQueryDto } from "../dtos/programs-search-query.dto";
import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";
import { DEFAULT_PAGE_SIZE } from "../search.constants";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

// TODO: use complete type
export interface PartialSearchableContent {
  id: string;
}

@Injectable()
export class ProgramsSearchService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly httpService: HttpService,
  ) {}

  async search(queryDto: ProgramsSearchQueryDto) {
    const { query, cursor, ...filters } = queryDto;

    const must: QueryDslQueryContainer[] = [];
    const filter: QueryDslQueryContainer[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ["title^3", "description", "skills^2"],
          fuzziness: "auto",
        },
      });
    }

    if (filters.type) {
      filter.push({ term: { type: filters.type } });
    }

    if (filters.start_date) {
      filter.push({
        range: { startDate: { gte: filters.start_date } },
      });
    }

    if (filters.end_date) {
      filter.push({
        range: { endDate: { lte: filters.end_date } },
      });
    }

    if (filters.max_participants) {
      filter.push({
        range: { maxParticipants: { lte: filters.max_participants } },
      });
    }

    if (filters.skills && filters.skills.length > 0) {
      filter.push({ terms: { skills: filters.skills } });
    }

    const results = await this.es.search<PartialSearchableContent>({
      index: "programs",
      size: DEFAULT_PAGE_SIZE,
      query: {
        function_score: {
          query: {
            bool: {
              ...(must.length > 0 ? { must } : {}),
              ...(filter.length > 0 ? { filter } : {}),
            },
          },
          functions: [
            {
              field_value_factor: {
                field: "enrollmentFillRate",
                factor: 1.0,
                missing: 0.0,
              },
            },
            {
              gauss: {
                startDate: {
                  origin: "now",
                  scale: "14d",
                  decay: 0.5,
                },
              },
            },
          ],
          boost_mode: "sum",
          score_mode: "sum",
        },
      },
      sort: [
        { _score: { order: "desc" } },
        { startDate: { order: "desc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = results.hits.hits;
    const programIds = Array.from(new Set(hits.map((hit) => hit._source!.id)));

    if (programIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const { data } = await firstValueFrom(
      this.httpService.post<any[]>("http://localhost:3002/programs/bulk", {
        programIds,
      }),
    );

    const lastHit = hits[hits.length - 1];
    const nextCursor = lastHit?.sort ?? null;

    return {
      items: data,
      nextCursor,
    };
  }
}
