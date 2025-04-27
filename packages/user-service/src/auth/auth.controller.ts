import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dtos/sign-up.dto";
import { LoginDto } from "./dtos/login.dto";
import { ResetPasswordService } from "./services/reset-password.service";
import {
  RequestPasswordResetDto,
  ResetPasswordDto,
} from "./dtos/reset-password-flow.dto";
import { UserTokenDto } from "./dtos/user-token.dto";
import { AccessRefreshTokenService } from "./services/access-refresh-token.service";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly resetPasswordService: ResetPasswordService,
    private readonly accessRefreshTokenService: AccessRefreshTokenService,
  ) {}

  @Post("signup")
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("refresh-token")
  async refreshToken(@Body() { userToken: refreshToken }: UserTokenDto) {
    const { userId, tokenId: oldTokenId } =
      await this.accessRefreshTokenService.validateRefreshToken(refreshToken);

    const newAccessToken =
      await this.accessRefreshTokenService.generateAccessToken(userId);
    const newRefreshToken =
      await this.accessRefreshTokenService.generateRefreshToken(userId);

    await this.accessRefreshTokenService.revokeRefreshToken(oldTokenId);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  @Post("request-password-reset")
  async requestPasswordReset(@Body() { email }: RequestPasswordResetDto) {
    const resetToken =
      await this.resetPasswordService.generatePasswordResetToken(email);

    return this.resetPasswordService.sendPasswordResetEmail(email, resetToken);
  }

  @Post("reset-password")
  async resetPassword(@Body() { resetToken, newPassword }: ResetPasswordDto) {
    const { userId } =
      await this.resetPasswordService.validatePasswordResetToken(resetToken);

    await this.authService.updatePassword(userId, newPassword);

    return this.resetPasswordService.invalidateResetPasswordToken(userId);
  }
}
