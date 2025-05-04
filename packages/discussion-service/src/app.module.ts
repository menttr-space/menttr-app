import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeORMModule } from "./database/typeorm.module";
import { PostModule } from "./post/post.module";
import { CommentModule } from "./comment/comment.module";
import { VoteModule } from "./vote/vote.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    PostModule,
    CommentModule,
    VoteModule,
  ],
})
export class AppModule {}
