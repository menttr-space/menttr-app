import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ProgramFeedService } from "./services/program-feed.service";
import { OptionalAuthGuard } from "src/auth/optional-auth.guard";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { FeedQueryDto } from "./dtos/feed-query.dto";
import { DiscussionFeedService } from "./services/discussion-feed.service";

@Controller("feed")
export class FeedController {
  constructor(
    private readonly programFeedService: ProgramFeedService,
    private readonly discussionFeedService: DiscussionFeedService,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get("programs")
  getProgramFeed(
    @AuthUser({ optional: true }) ctx: AuthContext,
    @Query() query: FeedQueryDto,
  ) {
    return this.programFeedService.getProgramFeed(query, ctx);
  }

  @Get("dicsussions")
  getDiscussionFeed(@Query() query: FeedQueryDto) {
    return this.discussionFeedService.getDiscussionFeed(query);
  }
}
