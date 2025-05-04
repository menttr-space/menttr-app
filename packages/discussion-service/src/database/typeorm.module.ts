import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Comment } from "src/common/entities/comment.entity";
import { Post } from "src/common/entities/post.entity";
import { Vote } from "src/common/entities/vote.entity";

const typeORMPostgresFactory = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  url: config.get<string>("PG_DATABASE_URL"),
  entities: [Post, Comment, Vote],
  synchronize: true,
});

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: typeORMPostgresFactory,
    }),
  ],
})
export class TypeORMModule {}
