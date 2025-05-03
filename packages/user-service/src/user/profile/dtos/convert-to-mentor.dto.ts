import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsString,
  Length,
} from "class-validator";

export class ConvertToMentorDto {
  @IsString()
  @Length(1, 30)
  displayName: string;

  @IsString()
  profileImage: string;

  @IsString()
  @Length(1, 600)
  bio: string;

  @IsString()
  @Length(1, 600)
  company: string;

  @IsString()
  @Length(1, 600)
  jobTitle: string;

  @IsString()
  @Length(1, 100)
  socialLink: string;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds: string[];
}
