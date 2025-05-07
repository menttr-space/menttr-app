import { Module } from "@nestjs/common";
import { TypeORMModule } from "./database/typeorm.module";
import { ConfigModule } from "@nestjs/config";
import { ProgramModule } from "./program/program.module";
import { ProgramParticipantModule } from "./program-participant/program-participant.module";
import { ProgramReviewModule } from "./program-review/program-review.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    ProgramModule,
    ProgramParticipantModule,
    ProgramReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
