import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { IsNull, MoreThan, Repository } from "typeorm";
import { JwtPayload } from "../types/auth-context.type";
import { JwtService } from "@nestjs/jwt";
import { UserToken } from "src/common/entities/user-token.entity";
import { addMilliseconds } from "date-fns";
import ms, { StringValue } from "ms";
import { UserTokenType } from "src/common/enums/user-token-type.enum";

@Injectable()
export class AccessRefreshTokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserToken)
    private readonly userTokenRepository: Repository<UserToken>,
  ) {}

  async generateAccessToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const payload: JwtPayload = {
      sub: userId,
      username: user.username,
      role: user.role,
    };

    const expiresIn = this.configService.getOrThrow<string>(
      "JWT_ACCESS_TOKEN_TTL",
    );

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  async generateRefreshToken(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const expiresIn = this.configService.getOrThrow<StringValue>(
      "JWT_REFRESH_TOKEN_TTL",
    );
    const expiresAt = addMilliseconds(new Date().getTime(), ms(expiresIn));

    const refreshToken = await this.userTokenRepository.save({
      userId: user.id,
      type: UserTokenType.RefreshToken,
      expiresAt,
    });

    const payload: Partial<JwtPayload> = {
      sub: userId,
      jti: refreshToken.id,
    };

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  async validateRefreshToken(refreshToken: string) {
    try {
      const payload: Partial<JwtPayload> = this.jwtService.verify(refreshToken);

      const token = await this.userTokenRepository.findOne({
        where: {
          id: payload.jti,
          type: UserTokenType.RefreshToken,
          expiresAt: MoreThan(new Date()),
          revokedAt: IsNull(),
        },
      });

      if (!token) {
        throw new BadRequestException("Invalid or expired token.");
      }

      return {
        userId: token.userId,
        tokenId: token.id,
      };
    } catch (err) {
      throw new BadRequestException("Invalid or expired token.");
    }
  }

  async revokeRefreshToken(jti: string) {
    await this.userTokenRepository.update(jti, { revokedAt: new Date() });
  }
}
