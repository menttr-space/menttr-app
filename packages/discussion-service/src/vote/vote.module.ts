import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { AuthModule } from "src/auth/auth.module";
import { Comment } from "src/common/entities/comment.entity";
import { Vote } from "src/common/entities/vote.entity";
import { VoteService } from "./vote.service";
import { VoteController } from "./vote.controller";

@Module({
  imports: [TypeOrmModule.forFeature([Post, Comment, Vote]), AuthModule],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
