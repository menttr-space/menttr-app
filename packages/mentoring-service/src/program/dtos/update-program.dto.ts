import { PartialType } from "@nestjs/mapped-types";
import { CreateProgramDto } from "./create-program.dto";
import { ProgramStatus } from "src/common/enums/program-status.enum";
import { IsEnum, IsOptional } from "class-validator";

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
  @IsOptional()
  @IsEnum(ProgramStatus)
  status: ProgramStatus;
}
