import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { Role } from "src/common/enums/role.enum";
import { IsNull, Not, Repository } from "typeorm";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  getPendingApplications() {
    return this.userRepository.find({
      where: {
        mentorAppliedAt: Not(IsNull()),
        mentorApprovedAt: IsNull(),
      },
      select: [
        "id",
        "email",
        "username",
        "displayName",
        "profileImageUrl",
        "bio",
        "company",
        "jobTitle",
        "socialLink",
        "mentorAppliedAt",
        "mentorApprovedAt",
      ],
    });
  }

  async approveApplication(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    user.role = Role.Mentor;
    user.mentorApprovedAt = new Date();

    await this.userRepository.save(user);

    // TODO: send mentee notification

    return { success: true };
  }

  async rejectApplication(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    user.mentorRejectedAt = new Date();

    await this.userRepository.save(user);

    // TODO: send mentee notification

    return { success: true };
  }
}
