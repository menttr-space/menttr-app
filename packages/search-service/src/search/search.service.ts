import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { SearchQueryDto } from "./dtos/search-query.dto";
import { QueryDslQueryContainer } from "@elastic/elasticsearch/lib/api/types";

@Injectable()
export class SearchService {
  constructor(private readonly es: ElasticsearchService) {}

  async searchPrograms(queryDto: SearchQueryDto) {
    const { query, ...filters } = queryDto;

    const must: QueryDslQueryContainer[] = [];
    const filter: QueryDslQueryContainer[] = [];

    if (query) {
      must.push({
        multi_match: {
          query,
          fields: ["title^3", "description"],
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

    const results = await this.es.search({
      index: "programs",
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
      sort: [{ _score: { order: "desc" } }],
    });

    return results.hits.hits;
  }
}
