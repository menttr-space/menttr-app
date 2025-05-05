import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { AuthModule } from "src/auth/auth.module";
import { Vote } from "src/common/entities/vote.entity";
import { Comment } from "src/common/entities/comment.entity";
import { CommentService } from "./comment.service";
import { PostCommentController } from "./post-comment.controller";
import { CommentReplyController } from "./comment-reply.controller";
import { RmqClientsModule } from "src/clients/rmq-clients.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Comment, Vote]),
    AuthModule,
    RmqClientsModule,
  ],
  controllers: [PostCommentController, CommentReplyController],
  providers: [CommentService],
})
export class CommentModule {}
