import { Module } from "@nestjs/common";
import { ElasticModule } from "src/elastic/elastic.module";
import { HttpModule } from "@nestjs/axios";
import { ProgramsIndexingController } from "./controllers/programs-events.controller";
import { ProgramsIndexingService } from "./services/programs-indexing.service";

@Module({
  imports: [ElasticModule, HttpModule],
  controllers: [ProgramsIndexingController],
  providers: [ProgramsIndexingService],
})
export class IndexingModule {}
