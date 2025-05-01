import { Module } from "@nestjs/common";
import { ProgramController } from "./program.controller";
import { ProgramService } from "./program.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProgramParticipantModule } from "src/program-participant/program-participant.module";
import { ProgramSkill } from "src/common/entities/program-skill.entity";
import { ProgramSpecialization } from "src/common/entities/program-specialization.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, ProgramSkill, ProgramSpecialization]),
    AuthModule,
    ProgramParticipantModule,
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
