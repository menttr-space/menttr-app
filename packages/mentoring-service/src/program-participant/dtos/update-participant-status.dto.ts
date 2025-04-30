import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";
import { ProgramParticipantStatus } from "src/common/enums/program-participant-status.enum";

export class UpdateParticipantStatusDto {
  @IsString()
  @IsNotEmpty()
  programId: string;

  @IsEnum(ProgramParticipantStatus)
  status: ProgramParticipantStatus;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  reason?: string;
}
