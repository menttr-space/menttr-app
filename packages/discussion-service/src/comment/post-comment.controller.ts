import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { CreateCommentDto } from "./dtos/create-comment.dto";
import { CommentService } from "./comment.service";

@Controller("posts/:postId/comments")
export class PostCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  getComments(@Param("postId") postId: string) {
    return this.commentService.getComments(postId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createComment(
    @AuthUser() ctx: AuthContext,
    @Param("postId") postId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentService.createComment(postId, dto, ctx);
  }
}
