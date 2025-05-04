import { IsISO8601, IsOptional } from "class-validator";

export class GetPostsDto {
  @IsOptional()
  @IsISO8601()
  cursor?: string;
}
