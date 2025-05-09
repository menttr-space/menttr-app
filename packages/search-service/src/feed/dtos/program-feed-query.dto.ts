import { Transform } from "class-transformer";
import { IsArray, IsOptional } from "class-validator";
import { transformToStringArray } from "src/search/search.util";

export class ProgramFeedQueryDto {
  @IsOptional()
  @IsArray()
  @Transform(transformToStringArray)
  readonly cursor?: any[];
}
