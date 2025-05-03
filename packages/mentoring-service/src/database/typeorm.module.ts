import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ProgramParticipant } from "src/common/entities/program-participant.entity";
import { ProgramSkill } from "src/common/entities/program-skill.entity";
import { Program } from "src/common/entities/program.entity";

const typeORMPostgresFactory = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  url: config.get<string>("PG_DATABASE_URL"),
  entities: [Program, ProgramParticipant, ProgramSkill],
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
