import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  newPasswordConfirmation: string;
}
