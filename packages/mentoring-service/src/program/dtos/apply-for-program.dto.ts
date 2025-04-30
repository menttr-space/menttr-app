import { IsString, Length } from "class-validator";

export class ApplyForProgramDto {
  @IsString()
  @Length(1, 600) // change min 100
  applicationMessage: string;
}
