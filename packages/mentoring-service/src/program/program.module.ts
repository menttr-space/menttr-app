import { Module } from "@nestjs/common";
import { ProgramController } from "./program.controller";
import { ProgramService } from "./program.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { Category } from "src/common/entities/category.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProgramParticipantModule } from "src/program-participant/program-participant.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Program, Category]),
    AuthModule,
    ProgramParticipantModule,
  ],
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
