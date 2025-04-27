import { Body, Controller, Get, Post, Put, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "src/common/entities/user.entity";
import { ProfileService } from "./profile.service";
import { UpdateProfileDto } from "./dtos/update-profile.dto";
import { ConvertToMentorDto } from "./dtos/convert-to-mentor.dto";

@Controller("user/profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getProfile(@AuthUser() user: User) {
    return this.profileService.getUserProfile(user.id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Put()
  updateProfile(
    @AuthUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profileService.updateProfile(user.id, updateProfileDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("convert-to-mentor")
  convertToMentor(
    @AuthUser() user: User,
    @Body() convertToMentorDto: ConvertToMentorDto,
  ) {
    return this.profileService.convertToMentor(user.id, convertToMentorDto);
  }
}
