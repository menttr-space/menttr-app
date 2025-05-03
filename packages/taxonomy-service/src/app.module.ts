import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeORMModule } from "./database/typeorm.module";
import { SkillService } from "./services/skill.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Skill } from "./entities/skill.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    TypeOrmModule.forFeature([Skill]),
  ],
  controllers: [AppController],
  providers: [SkillService],
})
export class AppModule {}
