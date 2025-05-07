import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ProgramReviewService } from "./program-review.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { CreateProgramReviewDto } from "./dtos/create-program-review.dto";

@Controller("programs/:programId/reviews")
export class ProgramReviewController {
  constructor(private readonly programReviewService: ProgramReviewService) {}

  @Get()
  getProgramReviews(@Param("programId") programId: string) {
    return this.programReviewService.getProgramReviews(programId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createReview(
    @AuthUser() ctx: AuthContext,
    @Param("programId") programId: string,
    @Body() dto: CreateProgramReviewDto,
  ) {
    return this.programReviewService.createReview(programId, dto, ctx);
  }
}
