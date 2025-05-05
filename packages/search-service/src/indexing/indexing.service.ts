import {
  IndexName,
  IndicesCreateRequest,
} from "@elastic/elasticsearch/lib/api/types";
import { Injectable, OnModuleInit } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";

@Injectable()
export abstract class IndexingService implements OnModuleInit {
  protected abstract indexName: IndexName;

  constructor(private readonly es: ElasticsearchService) {}

  async onModuleInit() {
    await this.initIndices();
  }

  async index(id: string, document: Record<string, any>) {
    return this.es.index({
      index: this.indexName,
      id,
      document,
    });
  }

  async update(id: string, partialDoc: Record<string, any>) {
    return this.es.update({
      index: this.indexName,
      id,
      doc: partialDoc,
    });
  }

  async delete(id: string) {
    return this.es.delete({
      index: this.indexName,
      id,
    });
  }

  protected async ensureIndex(config: Omit<IndicesCreateRequest, "index">) {
    const exists = await this.es.indices.exists({ index: this.indexName });
    if (!exists) {
      await this.es.indices.create({
        index: this.indexName,
        ...config,
      });
      console.log(`Created index: ${this.indexName}`);
    }
  }

  protected abstract initIndices(): Promise<void>;
}
