import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { TypeORMModule } from "./database/typeorm.module";
import { SpecializationService } from "./services/specialization.service";
import { SkillService } from "./services/skill.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Specialization } from "./entities/specialization.entity";
import { Skill } from "./entities/skill.entity";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    TypeOrmModule.forFeature([Specialization, Skill]),
  ],
  controllers: [AppController],
  providers: [SpecializationService, SkillService],
})
export class AppModule {}
