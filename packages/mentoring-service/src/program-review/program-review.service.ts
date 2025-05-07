import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { Repository } from "typeorm";
import { AuthContext } from "src/auth/auth-context.type";
import { ProgramStatus } from "src/common/enums/program-status.enum";
import { ProgramParticipantStatus } from "src/common/enums/program-participant-status.enum";
import { ProgramReview } from "src/common/entities/program-review.entity";
import { CreateProgramReviewDto } from "./dtos/create-program-review.dto";

@Injectable()
export class ProgramReviewService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(ProgramReview)
    private readonly programReviewRepository: Repository<ProgramReview>,
  ) {}

  getProgramReviews(programId: string) {
    return this.programReviewRepository.findBy({ programId });
  }

  async createReview(
    programId: string,
    dto: CreateProgramReviewDto,
    ctx: AuthContext,
  ) {
    const program = await this.programRepository.findOne({
      where: { id: programId },
      relations: ["participants"],
    });
    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    const isApprovedParticipant = program.participants.some(
      (participant) =>
        participant.userId === ctx.user.id &&
        participant.status === ProgramParticipantStatus.Approved,
    );

    if (
      ctx.user.id === program.ownerId ||
      program.status !== ProgramStatus.Completed ||
      !isApprovedParticipant
    ) {
      throw new ForbiddenException("You cannot review this program.");
    }

    const review = this.programReviewRepository.create({
      ...dto,
      userId: ctx.user.id,
      program,
    });

    await this.programReviewRepository.save(review);

    return { success: true };
  }
}
