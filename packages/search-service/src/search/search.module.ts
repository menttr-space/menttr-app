import { Module } from "@nestjs/common";
import { SearchController } from "./search.controller";
import { ElasticModule } from "src/elastic/elastic.module";
import { HttpModule } from "@nestjs/axios";
import { ProgramsSearchService } from "./services/programs-search.service";
import { DiscussionsSearchService } from "./services/discussions-search.service";

@Module({
  imports: [ElasticModule, HttpModule],
  controllers: [SearchController],
  providers: [ProgramsSearchService, DiscussionsSearchService],
})
export class SearchModule {}
