import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { ConvertToMentorDto } from "./dtos/convert-to-mentor.dto";
import { Role } from "src/common/enums/role.enum";
import { UserSkill } from "src/common/entities/user-skill.entity";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
  ) {}

  async getPublicProfile(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { passwordHash, email, ...rest } = user;

    return rest;
  }

  async getProfile(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { passwordHash, ...rest } = user;

    return rest;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ["skills", "specializations"],
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (dto.username) {
      if (dto.username === user.username) {
        throw new BadRequestException("Please choose a different username.");
      }

      const existingUsername = await this.userRepository.findOneBy({
        username: dto.username,
      });

      if (existingUsername) {
        throw new BadRequestException("Username has already been taken.");
      }
    }

    const { profileImage, skillIds, ...rest } = dto;

    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });

    // TODO: Handle profile image

    if (skillIds) {
      await this.userSkillRepository.delete({ userId });
      user.skills = skillIds.map((skillId) =>
        this.userSkillRepository.create({ skillId, user }),
      );
    }

    await this.userRepository.save(user);

    // TODO: return dto?

    return { success: true };
  }

  async convertToMentor(userId: string, dto: ConvertToMentorDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (
      user.role === Role.Mentor ||
      (user.mentorApprovedAt && user.mentorApprovedAt < new Date())
    ) {
      throw new BadRequestException(
        "You are already a mentor and cannot apply again.",
      );
    }

    if (user.mentorAppliedAt && user.mentorAppliedAt < new Date()) {
      throw new BadRequestException(
        "You have already applied to be a mentor. Please wait for you application to be reviewed.",
      );
    }

    const { profileImage, skillIds, ...rest } = dto;

    Object.assign(user, rest);

    // TODO: Handle profile image upload

    user.mentorAppliedAt = new Date();

    await this.userSkillRepository.delete({ userId });
    user.skills = skillIds.map((skillId) =>
      this.userSkillRepository.create({ skillId, user }),
    );

    await this.userRepository.save(user);

    // TODO: Send notification to admin about new application

    return { success: true };
  }
}
