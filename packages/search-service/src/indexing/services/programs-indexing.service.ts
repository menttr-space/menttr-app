import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProgramsIndexingService extends IndexingService {
  protected indexName = "programs";

  constructor(
    es: ElasticsearchService,
    private readonly httpService: HttpService,
  ) {
    super(es);
  }

  async index(id: string, document: Record<string, any>) {
    const { skillIds, ...doc } = document;
    const skillIdsString = (skillIds as string[]).toString();
    const skills = await firstValueFrom(
      this.httpService.get<{ slug: string }[]>(
        `http://localhost:3003/taxonomy/skills?ids=${skillIdsString}`,
      ),
    );
    doc.skills = skills.data.map((skill) => skill.slug);

    return super.index(id, doc);
  }

  protected async initIndices() {
    await this.ensureIndex({
      mappings: {
        properties: {
          title: { type: "text" },
          description: { type: "text" },
          type: { type: "keyword" },
          startDate: { type: "date" },
          endDate: { type: "date", null_value: "9999-12-31" },
          maxParticipants: { type: "integer" },
          activeParticipants: { type: "integer" },
          skills: { type: "keyword" },
          createdAt: { type: "date" },
        },
      },
    });
  }
}
