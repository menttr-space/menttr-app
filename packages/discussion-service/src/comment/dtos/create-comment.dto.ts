import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 600)
  content: string;
}
