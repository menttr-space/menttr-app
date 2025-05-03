import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Skill } from "src/entities/skill.entity";

const typeORMPostgresFactory = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  url: config.get<string>("PG_DATABASE_URL"),
  entities: [Skill],
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
