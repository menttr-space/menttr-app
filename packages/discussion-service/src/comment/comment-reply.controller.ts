import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@Controller("comments/:commentId/replies")
export class CommentReplyController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getReplies(@Param("commentId") commentId: string) {
    return this.commentService.getReplies(commentId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createReply(
    @AuthUser() ctx: AuthContext,
    @Param("commentId") commentId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createReply(commentId, dto, ctx);
  }
}
