import { Module } from "@nestjs/common";
import { ProgramReviewController } from "./program-review.controller";
import { ProgramReviewService } from "./program-review.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { AuthModule } from "src/auth/auth.module";
import { ProgramReview } from "src/common/entities/program-review.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Program, ProgramReview]), AuthModule],
  controllers: [ProgramReviewController],
  providers: [ProgramReviewService],
})
export class ProgramReviewModule {}
