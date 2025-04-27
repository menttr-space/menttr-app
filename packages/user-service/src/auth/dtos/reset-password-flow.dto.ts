import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RequestPasswordResetDto {
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsString()
  resetToken: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  newPassword: string;
}
