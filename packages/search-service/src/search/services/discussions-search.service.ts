import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { HttpService } from "@nestjs/axios";
import { DiscussionsSearchQueryDto } from "../dtos/discussions-search-query.dto";
import { firstValueFrom } from "rxjs";

export interface SearchableContent {
  id: string;
  type: "post" | "comment" | "reply";
  title?: string;
  content: string;
  postId: string;
  upvotesCount: number;
  commentsCount: number;
  createdAt: string;
}

// TODO: use complete post dto.
// Export here is for controller
export interface PartialPostDto {
  id: string;
}

@Injectable()
export class DiscussionsSearchService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly httpService: HttpService,
  ) {}

  async search(dto: DiscussionsSearchQueryDto) {
    const { query, cursor } = dto;

    const esResult = await this.es.search<SearchableContent>({
      index: "discussions",
      size: 10,
      query: {
        function_score: {
          query: {
            multi_match: {
              query,
              fields: ["title^3", "content"],
              fuzziness: "AUTO",
            },
          },
          functions: [
            {
              filter: { term: { type: "post" } },
              weight: 1,
            },
            {
              field_value_factor: {
                field: "upvotesCount",
                factor: 1.5,
                modifier: "sqrt",
                missing: 0,
              },
            },
            {
              field_value_factor: {
                field: "commentsCount",
                factor: 1.5,
                modifier: "sqrt",
                missing: 0,
              },
            },
            {
              gauss: {
                createdAt: {
                  origin: "now",
                  scale: "2d",
                  decay: 0.5,
                },
              },
              weight: 1.5,
            },
          ],
          score_mode: "sum",
          boost_mode: "sum",
        },
      },
      sort: [
        { _score: { order: "desc" } },
        { createdAt: { order: "desc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = esResult.hits.hits;

    const postIds = Array.from(
      new Set(
        hits.map((hit) => {
          if (!hit._source)
            throw new InternalServerErrorException("Missing _source in hit");
          return hit._source.postId;
        }),
      ),
    );

    if (postIds.length === 0) {
      return { items: [], nextCursor: null };
    }

    const { data } = await firstValueFrom(
      this.httpService.post<PartialPostDto[]>(
        "http://localhost:3005/posts/bulk",
        { postIds },
      ),
    );

    const lastHit = hits[hits.length - 1];
    const nextCursor = lastHit?.sort ?? null;

    return {
      items: data,
      nextCursor,
    };
  }
}
