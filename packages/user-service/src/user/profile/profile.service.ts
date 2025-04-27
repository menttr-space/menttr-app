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

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getUserProfile(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { passwordHash, ...rest } = user;

    return rest;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (dto.username) {
      const existingUsername = await this.userRepository.findOneBy({
        username: dto.username,
      });

      if (existingUsername) {
        throw new BadRequestException("Username has already been taken.");
      }
    }

    // Handle profile image
    const { profileImage, ...rest } = dto;

    Object.assign(user, rest);

    return await this.userRepository.save(user);
  }

  async convertToMentor(userId: string, dto: ConvertToMentorDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    if (
      user.role !== Role.Mentee ||
      (user.mentorApprovedAt && user.mentorApprovedAt < new Date())
    ) {
      throw new BadRequestException(
        "You are already a mentor and cannot apply again.",
      );
    }

    if (user.mentorAppliedAt && user.mentorAppliedAt < new Date()) {
      throw new BadRequestException(
        "Mentor application already submitted. You cannot apply again.",
      );
    }

    const { profileImage, ...rest } = dto;

    Object.assign(user, rest);
    user.mentorAppliedAt = new Date();

    await this.userRepository.save(user);

    // Send admin request

    return { success: true };
  }
}
