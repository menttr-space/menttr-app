import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post } from "src/common/entities/post.entity";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { AuthModule } from "src/auth/auth.module";
import { RmqClientsModule } from "src/clients/rmq-clients.module";

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AuthModule, RmqClientsModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
