import { Module } from "@nestjs/common";
import { FeedController } from "./feed.controller";
import { ElasticModule } from "src/elastic/elastic.module";
import { HttpModule } from "@nestjs/axios";
import { ProgramFeedService } from "./services/program-feed.service";
import { RmqClientsModule } from "src/clients/rmq-clients.module";
import { AuthModule } from "src/auth/auth.module";
import { DiscussionFeedService } from "./services/discussion-feed.service";

@Module({
  imports: [AuthModule, ElasticModule, HttpModule, RmqClientsModule],
  controllers: [FeedController],
  providers: [ProgramFeedService, DiscussionFeedService],
})
export class FeedModule {}
