import { QueryDslFunctionScoreContainer } from "@elastic/elasticsearch/lib/api/types";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { AuthContext } from "src/auth/auth-context.type";
import { EMBEDDING_SERVICE } from "src/clients/clients.constants";
import { PROGRAMS_INDEX } from "src/indexing/indexing.constants";
import { DEFAULT_PAGE_SIZE } from "src/search/search.constants";

type PartialSkillDto = {
  name: string;
};

type PartialUserSkillDto = {
  skillId: string;
};

type PartialUserDto = {
  id: string;
  bio: string;
  skills: PartialUserSkillDto[];
};

@Injectable()
export class ProgramFeedService {
  constructor(
    private readonly es: ElasticsearchService,
    private readonly httpService: HttpService,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingServiceClient: ClientProxy,
  ) {}

  async getProgramFeed(cursor: any[] | undefined, ctx: AuthContext) {
    const functions: QueryDslFunctionScoreContainer[] = [];

    if (ctx.user) {
      const { embedding } = await this.prepareUserEmbedding(ctx.user.id);
      functions.push({
        script_score: {
          script: {
            source: "cosineSimilarity(params.query_vector, 'embedding') + 1.0",
            params: {
              query_vector: embedding,
            },
          },
        },
        weight: 1,
      });
    }

    const esResult = await this.es.search({
      index: PROGRAMS_INDEX,
      size: DEFAULT_PAGE_SIZE,
      query: {
        function_score: {
          query: {
            bool: {
              filter: [{ range: { startDate: { gte: "now" } } }],
            },
          },
          functions: [
            ...functions,
            {
              field_value_factor: {
                field: "enrollmentFillRate",
                factor: 1.0,
                missing: 0.0,
              },
              weight: 1,
            },
            {
              gauss: {
                startDate: {
                  origin: "now",
                  scale: "14d",
                  decay: 0.5,
                },
              },
              weight: 1,
            },
          ],
          boost_mode: "sum",
          score_mode: "sum",
        },
      },
      fields: ["title", "startDate", "createdAt"],
      _source: false,
      sort: [
        { _score: { order: "desc" } },
        { startDate: { order: "asc" } },
        { id: { order: "desc" } },
      ],
      search_after: cursor,
    });

    const hits = esResult.hits.hits;
    const programIds = Array.from(new Set(hits.map((hit) => hit._id)));

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

  private async prepareUserEmbedding(userId: string) {
    const { data: user } = await firstValueFrom(
      this.httpService.get<PartialUserDto>(
        `http://localhost:3001/user/${userId}/profile`,
      ),
    );
    const skillIdsString = user.skills.map((skill) => skill.skillId).join(",");

    const { data: skills } = await firstValueFrom(
      this.httpService.get<PartialSkillDto[]>(
        `http://localhost:3003/taxonomy/skills?ids=${skillIdsString}`,
      ),
    );
    const skillNamesString = skills.map((skill) => skill.name).join(",");

    return await firstValueFrom(
      this.embeddingServiceClient.send<{ embedding: number[] }>(
        { cmd: "embed" },
        {
          text: `Bio: ${user.bio}\nSkills: ${skillNamesString}`,
        },
      ),
    );
  }
}
