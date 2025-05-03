import {
  IsOptional,
  IsString,
  Matches,
  Length,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
} from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores.",
  })
  @Length(4, 20, { message: "Username must be between 4 and 32 characters." })
  username?: string;

  @IsOptional()
  @IsString()
  @Length(1, 30, {
    message: "Display name must be between 1 and 50 characters.",
  })
  displayName?: string;

  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsOptional()
  @IsString()
  @Length(1, 600, { message: "Bio must be at most 600 characters." })
  bio?: string;

  @IsOptional()
  @IsString()
  @Length(2)
  country?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  company?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  socialLink?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds?: string[];
}
