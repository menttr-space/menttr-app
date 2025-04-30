import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthContext } from "src/auth/auth-context.type";
import { ProgramParticipant } from "src/common/entities/program-participant.entity";
import { Program } from "src/common/entities/program.entity";
import { ProgramParticipantStatus } from "src/common/enums/program-participant-status.enum";
import { Repository } from "typeorm";
import { UpdateParticipantStatusDto } from "./dtos/update-participant-status.dto";
import { ProgramStatus } from "src/common/enums/program-status.enum";

@Injectable()
export class ProgramParticipantService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(ProgramParticipant)
    private readonly participantRepository: Repository<ProgramParticipant>,
  ) {}

  async getProgramParticipants(programId: string, ctx: AuthContext) {
    const program = await this.programRepository.findOneBy({ id: programId });
    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (ctx.user.id === program.ownerId) {
      return this.participantRepository.findBy({ programId });
    }

    return this.participantRepository.find({
      where: {
        programId,
        status: ProgramParticipantStatus.Approved,
      },
      select: ["userId", "status", "registeredAt", "createdAt", "updatedAt"],
    });
  }

  async registerParticipant(
    userId: string,
    programId: string,
    applicationMessage: string,
  ) {
    const hasApplied = await this.participantRepository.findOne({
      where: {
        programId,
        userId,
      },
    });

    if (hasApplied) {
      switch (hasApplied.status) {
        case ProgramParticipantStatus.Pending:
          throw new ConflictException(
            "You have already applied for this program. Please wait for your mentor to review and approve your application.",
          );
        case ProgramParticipantStatus.Approved:
          throw new BadRequestException(
            "You are already approved for this program.",
          );
        case ProgramParticipantStatus.Rejected:
          throw new ForbiddenException(
            "Your application for this program was rejected. You cannot apply again at this time.",
          );
      }
    }

    const participant = this.participantRepository.create({
      programId,
      userId,
      applicationMessage,
    });

    // TODO: send notification to the mentor

    return this.participantRepository.save(participant);
  }

  async updateParticipantStatus(
    participantId: string,
    dto: UpdateParticipantStatusDto,
    ctx: AuthContext,
  ) {
    const { programId, status, reason } = dto;

    const program = await this.programRepository.findOneBy({
      id: programId,
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    const participant = await this.participantRepository.findOneBy({
      id: participantId,
    });

    if (!participant) {
      throw new NotFoundException("Participant not found.");
    }

    if (ctx.user.id !== program.ownerId && ctx.user.role !== "mentor") {
      throw new ForbiddenException(
        "You cannot approve participants for this program.",
      );
    }

    if (program.status !== ProgramStatus.Enrollment) {
      throw new BadRequestException(
        "You cannot approve participants after the enrollment period has ended.",
      );
    }

    if (status === ProgramParticipantStatus.Approved) {
      if (program.activeParticipants >= program.maxParticipants) {
        throw new ConflictException(
          "Cannot approve participant because the program is full.",
        );
      }

      participant.registeredAt = new Date();

      program.activeParticipants += 1;
      await this.programRepository.save(program);

      // TODO: send notification to this participant about approval

      // Reject remaining participants
      if (program.activeParticipants >= program.maxParticipants) {
        await this.participantRepository.update(
          { programId, status: ProgramParticipantStatus.Pending },
          { status: ProgramParticipantStatus.Rejected, rejectedAt: new Date() },
        );

        // TODO: send notifications to all remaining participants about rejection
      }
    } else if (status === ProgramParticipantStatus.Rejected) {
      participant.rejectedAt = new Date();
      if (reason) {
        participant.rejectionReason = reason;
      }

      // TODO: send notification to this participant about rejection
      // Maybe store rejection info (no column yet)
    }

    participant.status = status;
    await this.participantRepository.save(participant);

    return { success: true };
  }
}
