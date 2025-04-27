import { Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class SignUpDto {
  @IsEmail()
  @MaxLength(255)
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) => value.toLowerCase())
  readonly email: string;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @IsNotEmpty()
  readonly password: string;
}
