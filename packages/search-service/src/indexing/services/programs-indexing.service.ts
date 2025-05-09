import { Inject, Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { EMBEDDING_SERVICE } from "src/clients/clients.constants";
import { ClientProxy } from "@nestjs/microservices";
import { PROGRAMS_INDEX } from "../indexing.constants";

// TODO: use complete type
type PartialSkillsDto = {
  name: string;
  slug: string;
};

@Injectable()
export class ProgramsIndexingService extends IndexingService {
  protected indexName = PROGRAMS_INDEX;

  constructor(
    es: ElasticsearchService,
    private readonly httpService: HttpService,
    @Inject(EMBEDDING_SERVICE)
    private readonly embeddingServiceClient: ClientProxy,
  ) {
    super(es);
  }

  async index(id: string, document: Record<string, any>) {
    const { skillIds, ...doc } = document;

    const skillIdsString = (skillIds as string[]).toString();
    const { data: skills } = await firstValueFrom(
      this.httpService.get<PartialSkillsDto[]>(
        `http://localhost:3003/taxonomy/skills?ids=${skillIdsString}`,
      ),
    );
    const skillSlugs = skills.map((skill) => skill.slug);
    const skillNamesString = skills.map((skill) => skill.name).join(",");

    doc.skills = skillSlugs;

    const { embedding } = await firstValueFrom(
      this.embeddingServiceClient.send<{ embedding: number[] }>(
        { cmd: "embed" },
        {
          text: `Title: ${doc.title}\nDescription: ${doc.description}\nSkills: ${skillNamesString}`,
        },
      ),
    );

    doc.embedding = embedding;

    return super.index(id, doc);
  }

  protected async initIndices() {
    await this.ensureIndex({
      settings: {
        analysis: {
          normalizer: {
            lowercase_normalizer: {
              type: "custom",
              filter: ["lowercase", "asciifolding"],
            },
          },
        },
      },
      mappings: {
        properties: {
          id: { type: "keyword" },
          title: { type: "text" },
          description: { type: "text" },
          type: { type: "keyword" },
          startDate: { type: "date" },
          endDate: { type: "date", null_value: "9999-12-31" },
          enrollmentFillRate: { type: "double" },
          skills: { type: "keyword", normalizer: "lowercase_normalizer" },
          createdAt: { type: "date" },
          embedding: {
            type: "dense_vector",
            dims: 384,
            index: true,
            similarity: "cosine",
          },
        },
      },
    });
  }
}
