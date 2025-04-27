import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignUpDto } from "./dtos/sign-up.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/common/entities/user.entity";
import { LoginDto } from "./dtos/login.dto";
import { HashingService } from "./services/hashing.service";
import { AccessRefreshTokenService } from "./services/access-refresh-token.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
    private readonly accessRefreshTokenService: AccessRefreshTokenService,
  ) {}

  async signUp({ email, username, password }: SignUpDto) {
    const existingUsers = await this.userRepository.find({
      where: [{ email }, { username }],
    });

    const emailAvailable = !existingUsers.some((user) => user.email === email);
    const usernameAvailable = !existingUsers.some(
      (user) => user.username === username,
    );

    if (!emailAvailable) {
      throw new BadRequestException("Email has already been taken.");
    }

    if (!usernameAvailable) {
      throw new BadRequestException("Username has already been taken.");
    }

    const passwordHash = await this.hashingService.hash(password);

    const user = new User();
    user.email = email;
    user.username = username;
    user.passwordHash = passwordHash;

    await this.userRepository.save(user);

    return {
      accessToken: await this.accessRefreshTokenService.generateAccessToken(
        user.id,
      ),
      refreshToken: await this.accessRefreshTokenService.generateRefreshToken(
        user.id,
      ),
    };
  }

  async login({ identifier, password }: LoginDto) {
    const user = await this.userRepository.findOne({
      where: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      throw new UnauthorizedException("Incorrect email or password.");
    }

    const passwordValid = await this.hashingService.compare(
      password,
      user.passwordHash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException("Incorrect email or password.");
    }

    return {
      accessToken: await this.accessRefreshTokenService.generateAccessToken(
        user.id,
      ),
      refreshToken: await this.accessRefreshTokenService.generateRefreshToken(
        user.id,
      ),
    };
  }

  async updatePassword(userId: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const newPasswordHash = await this.hashingService.hash(newPassword);

    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
    });

    // TODO: send email about password change

    return { success: true };
  }
}
