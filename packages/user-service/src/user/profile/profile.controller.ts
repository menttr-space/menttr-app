import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "src/common/entities/user.entity";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { ConvertToMentorDto } from "./dtos/convert-to-mentor.dto";

@Controller("user")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(":userId/profile")
  getPublicProfile(@Param("userId") userId: string) {
    return this.profileService.getPublicProfile(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  getProfile(@AuthUser() user: User) {
    return this.profileService.getProfile(user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch("profile")
  updateProfile(
    @AuthUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("profile/convert-to-mentor")
  convertToMentor(
    @AuthUser() user: User,
    @Body() convertToMentorDto: ConvertToMentorDto,
  ) {
    return this.profileService.convertToMentor(user.id, convertToMentorDto);
  }
}
