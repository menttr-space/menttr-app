import { IsNotEmpty, IsString } from "class-validator";

export class UserTokenDto {
  @IsString()
  @IsNotEmpty()
  userToken: string;
}
