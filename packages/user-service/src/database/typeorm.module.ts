import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { UserToken } from "src/common/entities/user-token.entity";
import { User } from "src/common/entities/user.entity";

const typeORMPostgresFactory = (
  config: ConfigService,
): TypeOrmModuleOptions => ({
  type: "postgres",
  url: config.get<string>("PG_DATABASE_URL"),
  entities: [User, UserToken],
  // logging: ["error"],
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
