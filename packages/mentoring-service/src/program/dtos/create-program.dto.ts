import { Type } from "class-transformer";
import {
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from "class-validator";
import { ProgramType } from "src/common/enums/program-type.enum";

export class CreateProgramDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  title: string;

  @IsEnum(ProgramType)
  type: ProgramType;

  @IsOptional()
  @IsString()
  @MaxLength(600)
  description?: string;

  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;

  @IsInt()
  @Min(1)
  maxParticipants: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  meetingLink?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  skillIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsString({ each: true })
  specializationIds?: string[];
}
