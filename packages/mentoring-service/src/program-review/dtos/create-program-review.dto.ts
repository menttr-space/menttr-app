import { IsOptional, IsString, Length, Max, Min } from "class-validator";

export class CreateProgramReviewDto {
  @IsString()
  @Length(1, 600)
  content: string;

  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;
}
