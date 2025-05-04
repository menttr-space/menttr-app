import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 600)
  content: string;

  createdAt: string;
}
