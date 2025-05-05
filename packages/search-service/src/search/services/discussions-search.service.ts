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
  replyToId?: string;
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
      size: 5,
      query: {
        multi_match: {
          query,
          fields: ["title^2", "content"],
          fuzziness: "AUTO",
        },
      },
      sort: [
        { _score: { order: "desc" } },
        { createdAt: { order: "desc" } },
        { id: { order: "asc" } },
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
      this.httpService.post<PartialPostDto>(
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
