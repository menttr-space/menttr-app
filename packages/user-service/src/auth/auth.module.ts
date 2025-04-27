import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.stragery";
import { PassportModule } from "@nestjs/passport";
import { ResetPasswordService } from "./services/reset-password.service";
import { UserToken } from "src/common/entities/user-token.entity";
import { HashingService } from "./services/hashing.service";
import { AccessRefreshTokenService } from "./services/access-refresh-token.service";

const jwtRegisterFactory = (
  configService: ConfigService,
): JwtModuleOptions => ({
  secret: configService.get("JWT_SECRET"),
});

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserToken]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: jwtRegisterFactory,
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashingService,
    ResetPasswordService,
    AccessRefreshTokenService,
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
