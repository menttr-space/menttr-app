import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthContext } from "src/auth/auth-context.type";
import { AuthUser } from "src/auth/auth-user.decorator";
import { ProgramParticipantService } from "./program-participant.service";
import { UpdateParticipantStatusDto } from "./dtos/update-participant-status.dto";

@Controller("participants")
export class ProgramParticipantController {
  constructor(
    private readonly programParticipantService: ProgramParticipantService,
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getProgramParticipants(
    @AuthUser() ctx: AuthContext,
    @Query("program_id") programId: string,
  ) {
    return this.programParticipantService.getProgramParticipants(
      programId,
      ctx,
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(":participantId/status")
  updateParticipantStatus(
    @AuthUser() ctx: AuthContext,
    @Param("participantId") participantId: string,
    @Body() dto: UpdateParticipantStatusDto,
  ) {
    return this.programParticipantService.updateParticipantStatus(
      participantId,
      dto,
      ctx,
    );
  }
}
