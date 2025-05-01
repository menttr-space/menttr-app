import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ProgramService } from "./program.service";
import { CreateProgramDto } from "./dtos/create-program.dto";
import { UpdateProgramDto } from "./dtos/update-program.dto";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/auth/auth-user.decorator";
import { AuthContext } from "src/auth/auth-context.type";
import { ApplyForProgramDto } from "./dtos/apply-for-program.dto";

@Controller("program")
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  // No longer valid
  @Get("feed")
  getProgramsFeed(@Query("categories") categories?: string) {
    const categoriesIds = categories
      ? categories
          .split(",")
          .map(Number)
          .filter((n) => !isNaN(n))
      : undefined;

    return this.programService.getProgramsFeed(categoriesIds);
  }

  @Get(":programId")
  getProgram(@Param("programId") programId: string) {
    return this.programService.getProgram(programId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  createProgram(
    @AuthUser() ctx: AuthContext,
    @Body() createProgramDto: CreateProgramDto,
  ) {
    return this.programService.createProgram(createProgramDto, ctx);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":programId")
  updateProgram(
    @AuthUser() ctx: AuthContext,
    @Param("programId") programId: string,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programService.updateProgram(programId, dto, ctx);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post(":programId/apply")
  applyForProgram(
    @AuthUser() ctx: AuthContext,
    @Param("programId") programId: string,
    @Body() dto: ApplyForProgramDto,
  ) {
    return this.programService.applyForProgram(programId, dto, ctx);
  }

  // programs?user_id enpoint
  @Get("user/:userId")
  getPrograms(@Param("userId") userId: string) {
    return this.programService.getUserPrograms(userId);
  }
}
