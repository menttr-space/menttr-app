import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Program } from "src/common/entities/program.entity";
import { Repository } from "typeorm";
import { CreateProgramDto } from "./dtos/create-program.dto";
import { UpdateProgramDto } from "./dtos/update-program.dto";
import { AuthContext } from "src/auth/auth-context.type";
import { ProgramStatus } from "src/common/enums/program-status.enum";
import { ApplyForProgramDto } from "./dtos/apply-for-program.dto";
import { ProgramParticipantService } from "src/program-participant/program-participant.service";
import { ProgramSkill } from "src/common/entities/program-skill.entity";
import { ProgramSpecialization } from "src/common/entities/program-specialization.entity";

@Injectable()
export class ProgramService {
  constructor(
    @InjectRepository(Program)
    private readonly programRepository: Repository<Program>,
    @InjectRepository(ProgramSkill)
    private readonly programSkillRepository: Repository<ProgramSkill>,
    @InjectRepository(ProgramSpecialization)
    private readonly programSpecializationRepository: Repository<ProgramSpecialization>,
    private readonly programParticipantService: ProgramParticipantService,
  ) {}

  async getProgramsFeed(categories?: number[]) {
    const query = this.programRepository
      .createQueryBuilder("programs")
      .leftJoinAndSelect("programs.categories", "category");

    if (categories && categories.length > 0) {
      query.andWhere("category.id IN (:...categories)", { categories });
    }

    const items = await query.getMany();
    // const allCategories = await this.categoryRepository.find();

    return { items };
  }

  getProgram(programId: string) {
    return this.programRepository.findOne({
      where: { id: programId },
      relations: ["skills", "specializations"],
    });
  }

  async createProgram(dto: CreateProgramDto, ctx: AuthContext) {
    if (ctx.user.role !== "mentor") {
      throw new ForbiddenException("Only mentors can create programs.");
    }

    if (dto.endDate && dto.startDate >= dto.endDate) {
      throw new BadRequestException("End date cannot be before start date.");
    }

    const program = this.programRepository.create({
      ...dto,
      ownerId: ctx.user.id,
      status: ProgramStatus.Enrollment,
    });

    await this.programRepository.save(program);

    const { skillIds, specializationIds } = dto;

    if (skillIds) {
      program.skills = skillIds.map((skillId) =>
        this.programSkillRepository.create({ skillId, program }),
      );
    }

    if (specializationIds) {
      program.specializations = specializationIds.map((specializationId) =>
        this.programSpecializationRepository.create({
          specializationId,
          program,
        }),
      );
    }

    return this.programRepository.save(program);
  }

  async updateProgram(
    programId: string,
    dto: UpdateProgramDto,
    ctx: AuthContext,
  ) {
    if (ctx.user.role !== "mentor") {
      throw new ForbiddenException("Only mentors can update programs.");
    }

    const program = await this.programRepository.findOne({
      where: { id: programId, ownerId: ctx.user.id },
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (program.status === ProgramStatus.Completed) {
      throw new BadRequestException("Cannot update program when completed.");
    }

    // Fields allowed to be updated after enrollment

    const { meetingLink, status, ...restNotUpdatableAfterEnrollment } = dto;

    program.meetingLink = meetingLink ?? program.meetingLink;
    program.status = status ?? program.status;

    // Fields NOT allowed to be updated after enrollment

    if (program.status !== ProgramStatus.Enrollment) {
      for (const [key, val] of Object.entries(
        restNotUpdatableAfterEnrollment,
      )) {
        if (val) {
          throw new BadRequestException(
            `Cannot update ${key} after enrollment on the program is finished.`,
          );
        }
      }
    }

    const {
      startDate,
      endDate,
      skillIds,
      specializationIds,
      ...restUpdateable
    } = restNotUpdatableAfterEnrollment;

    Object.entries(restUpdateable).forEach(([key, value]) => {
      if (value !== undefined) {
        program[key] = value;
      }
    });

    if (startDate) {
      const compareEndDate = endDate ?? program.endDate;
      if (compareEndDate) {
        throw new BadRequestException("Start date cannot be after end date.");
      }

      program.startDate = startDate;
    }

    if (endDate) {
      const compareStartDate = dto.startDate ?? program.startDate;
      if (compareStartDate) {
        throw new BadRequestException("End date cannot be before start date.");
      }

      program.endDate = endDate;
    }

    if (skillIds) {
      await this.programSkillRepository.delete({ programId });
      program.skills = skillIds.map((skillId) =>
        this.programSkillRepository.create({ skillId, program }),
      );
    }

    if (specializationIds) {
      await this.programSpecializationRepository.delete({ programId });
      program.specializations = specializationIds.map((specializationId) =>
        this.programSpecializationRepository.create({
          specializationId,
          program,
        }),
      );
    }

    return this.programRepository.save(program);
  }

  async applyForProgram(
    programId: string,
    dto: ApplyForProgramDto,
    ctx: AuthContext,
  ) {
    const program = await this.programRepository.findOneBy({
      id: programId,
    });

    if (!program) {
      throw new NotFoundException("Program not found.");
    }

    if (ctx.user.id === program.ownerId) {
      throw new ForbiddenException("You cannot apply for this program.");
    }

    if (program.activeParticipants >= program.maxParticipants) {
      throw new ConflictException(
        "You cannot apply for this program because it has reached the maximum number of participants.",
      );
    }

    return this.programParticipantService.registerParticipant(
      ctx.user.id,
      programId,
      dto.applicationMessage,
    );
  }

  // Move this to a separate user/programs module?
  async getUserPrograms(userId: string) {
    return this.programRepository.findBy({ id: userId });
  }
}
