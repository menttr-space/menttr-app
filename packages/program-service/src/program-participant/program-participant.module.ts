import { Module } from "@nestjs/common";
import { ProgramParticipantController } from "./program-participant.controller";
import { ProgramParticipantService } from "./program-participant.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { ProgramParticipant } from "src/common/entities/program-participant.entity";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, ProgramParticipant]),
    AuthModule,
  ],
  controllers: [ProgramParticipantController],
  providers: [ProgramParticipantService],
  exports: [ProgramParticipantService],
})
export class ProgramParticipantModule {}
