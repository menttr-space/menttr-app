import { Module } from "@nestjs/common";
import { ElasticModule } from "src/elastic/elastic.module";
import { HttpModule } from "@nestjs/axios";
import { ProgramsIndexingController } from "./controllers/programs-events.controller";
import { ProgramsIndexingService } from "./services/programs-indexing.service";
import { DiscussionsIndexingController } from "./controllers/discussions-events.controller";
import { DiscussionsIndexingService } from "./services/discussions-indexing.service";

@Module({
  imports: [ElasticModule, HttpModule],
  controllers: [ProgramsIndexingController, DiscussionsIndexingController],
  providers: [ProgramsIndexingService, DiscussionsIndexingService],
})
export class IndexingModule {}
