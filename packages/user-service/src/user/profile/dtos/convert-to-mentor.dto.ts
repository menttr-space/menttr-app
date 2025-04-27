import { IsString } from "class-validator";

export class ConvertToMentorDto {
  @IsString()
  displayName: string;

  @IsString()
  profileImage: string;

  @IsString()
  bio: string;

  @IsString()
  company: string;

  @IsString()
  jobTitle: string;

  // more fields to become a mentor ...
}
