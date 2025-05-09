import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ProgramFeedService } from "./services/program-feed.service";
import { ProgramFeedQueryDto } from "./dtos/program-feed-query.dto";
import { OptionalAuthGuard } from "src/auth/optional-auth.guard";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";

@Controller("feed")
export class FeedController {
  constructor(private readonly programFeedService: ProgramFeedService) {}

  @UseGuards(OptionalAuthGuard)
  @Get("programs")
  getProgramsFeed(
    @AuthUser({ optional: true }) ctx: AuthContext,
    @Query() { cursor }: ProgramFeedQueryDto,
  ) {
    return this.programFeedService.getProgramFeed(cursor, ctx);
  }
}
