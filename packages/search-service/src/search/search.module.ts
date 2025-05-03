import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { SearchService } from "./search.service";
import { ElasticModule } from "src/elastic/elastic.module";

@Module({
  imports: [ElasticModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
