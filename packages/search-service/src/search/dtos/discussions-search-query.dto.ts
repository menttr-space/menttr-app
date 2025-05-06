import { Transform } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { transformToStringArray } from "../search.util";

export class DiscussionsSearchQueryDto {
  @IsString()
  @IsNotEmpty()
  readonly query: string;

  @IsOptional()
  @IsArray()
  @Transform(transformToStringArray)
  readonly cursor?: any[];
}
