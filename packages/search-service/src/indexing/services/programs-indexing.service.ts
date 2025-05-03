import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { IndexingService } from "../indexing.service";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProgramsIndexingService extends IndexingService {
  constructor(
    es: ElasticsearchService,
    private readonly httpService: HttpService,
  ) {
    super(es);
  }

  async index(index: string, id: string, document: Record<string, any>) {
    const { skillIds, specializationIds, ...doc } = document;
    const skillIdsString = (skillIds as string[]).toString();
    const specializationIdsString = (specializationIds as string[]).toString();

    const skills = await firstValueFrom(
      this.httpService.get<{ slug: string }[]>(
        `http://localhost:3003/taxonomy/skills?ids=${skillIdsString}`,
      ),
    );
    const specializations = await firstValueFrom(
      this.httpService.get<{ slug: string }[]>(
        `http://localhost:3003/taxonomy/specializations?ids=${specializationIdsString}`,
      ),
    );

    doc.skills = skills.data.map((skill) => skill.slug);
    doc.specializations = specializations.data.map(
      (specialization) => specialization.slug,
    );

    return super.index(index, id, doc);
  }

  protected async initIndices() {
    await this.ensureIndex("programs", {
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
          specializations: { type: "keyword" },
          createdAt: { type: "date" },
        },
      },
    });
  }
}
