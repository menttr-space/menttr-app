import { Controller, Delete, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { VoteService } from "./vote.service";

@Controller()
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("posts/:postId/votes")
  addPostVote(@AuthUser() ctx: AuthContext, @Param("postId") postId: string) {
    return this.voteService.addPostVote(postId, ctx);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("posts/:postId/votes")
  removePostVote(
    @AuthUser() ctx: AuthContext,
    @Param("postId") postId: string,
  ) {
    return this.voteService.removePostVote(postId, ctx);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("comments/:commentId/votes")
  addCommentVote(
    @AuthUser() ctx: AuthContext,
    @Param("commentId") commentId: string,
  ) {
    return this.voteService.addCommentVote(commentId, ctx);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("comments/:commentId/votes")
  removeCommentVote(
    @AuthUser() ctx: AuthContext,
    @Param("commentId") commentId: string,
  ) {
    return this.voteService.removeCommentVote(commentId, ctx);
  }
}
