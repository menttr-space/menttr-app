import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { Repository } from "typeorm";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { HashingService } from "src/auth/services/hashing.service";
import { ChangeAccountInformationDto } from "./dtos/change-account-information.dto";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async changeAccountInformation(
    userId: string,
    dto: ChangeAccountInformationDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { email } = dto;

    const existingEmail = await this.userRepository.findOneBy({ email });
    if (existingEmail) {
      throw new BadRequestException("Email has already been taken.");
    }

    user.email = email;

    // TODO: handle email verification

    return await this.userRepository.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { currentPassword, newPassword, newPasswordConfirmation } = dto;

    if (newPassword !== newPasswordConfirmation) {
      throw new BadRequestException("Passwords do not match.");
    }

    const passwordValid = await this.hashingService.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new BadRequestException("Incorrect current password.");
    }

    const newPasswordHash = await this.hashingService.hash(newPassword);
    user.passwordHash = newPasswordHash;

    await this.userRepository.save(user);

    return { success: true };
  }
}
