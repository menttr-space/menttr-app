import { IndicesCreateRequest } from "@elastic/elasticsearch/lib/api/types";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export abstract class IndexingService implements OnModuleInit {
  constructor(private readonly es: ElasticsearchService) {}

  async onModuleInit() {
    await this.initIndices();
  }

  async index(index: string, id: string, document: Record<string, any>) {
    return this.es.index({
      index,
      id,
      document,
    });
  }

  async update(index: string, id: string, partialDoc: Record<string, any>) {
    return this.es.update({
      index,
      id,
      doc: partialDoc,
    });
  }

  async delete(index: string, id: string) {
    return this.es.delete({
      index,
      id,
    });
  }

  protected async ensureIndex(
    index: string,
    config: Omit<IndicesCreateRequest, "index">,
  ) {
    const exists = await this.es.indices.exists({ index });
    if (!exists) {
      await this.es.indices.create({
        index,
        ...config,
      });
      console.log(`Created index: ${index}`);
    }
  }

  protected abstract initIndices(): Promise<void>;
}
