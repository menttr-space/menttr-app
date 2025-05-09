import { Module } from "@nestjs/common";
import { FeedController } from "./feed.controller";
import { ElasticModule } from "src/elastic/elastic.module";
import { HttpModule } from "@nestjs/axios";
import { ProgramFeedService } from "./services/program-feed.service";
import { RmqClientsModule } from "src/clients/rmq-clients.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [AuthModule, ElasticModule, HttpModule, RmqClientsModule],
  controllers: [FeedController],
  providers: [ProgramFeedService],
})
export class FeedModule {}
