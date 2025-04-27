import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserToken } from "src/common/entities/user-token.entity";
import { User } from "src/common/entities/user.entity";
import { IsNull, MoreThan, Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";
import ms, { StringValue } from "ms";
import { addMilliseconds } from "date-fns";
import { UserTokenType } from "src/common/enums/user-token-type.enum";

type TokenOrNull = string | null;

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async generatePasswordResetToken(email: string): Promise<TokenOrNull> {
    const user = await this.userRepository.findOneBy({
      email,
    });

    if (!user) {
      return null;
    }

    const resetToken = crypto.randomBytes(16).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const expiresIn = this.configService.getOrThrow<StringValue>(
      "PASSWORD_RESET_TOKEN_TTL",
    );
    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));

    await this.userTokenRepository.save({
      userId: user.id,
      type: UserTokenType.PasswordResetToken,
      value: resetTokenHash,
      expiresAt,
    });

    return resetToken;
  }

  sendPasswordResetEmail(email: string, token: TokenOrNull) {
    // Always return generic message
    return {
      message: `We've sent a password reset link to email ${email}.\nClick it to reset your password.`,
      token,
    };
  }

  async validatePasswordResetToken(resetToken: string) {
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const token = await this.userTokenRepository.findOne({
      where: {
        type: UserTokenType.PasswordResetToken,
        value: resetTokenHash,
        expiresAt: MoreThan(new Date()),
        revokedAt: IsNull(),
      },
    });

    if (!token || !token.userId) {
      throw new BadRequestException("Invalid or expired token.");
    }

    const user = await this.userRepository.findOne({
      where: { id: token.userId },
    });

    if (!user) {
      throw new NotFoundException(
        "User associated with this token is not found.",
      );
    }

    return {
      userId: user.id,
    };
  }

  async invalidateResetPasswordToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(
        "User associated with this token is not found.",
      );
    }

    await this.userTokenRepository.update(
      {
        userId,
        type: UserTokenType.PasswordResetToken,
      },
      {
        revokedAt: new Date(),
      },
    );

    return { success: true };
  }
}
