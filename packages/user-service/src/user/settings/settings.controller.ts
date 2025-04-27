import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { AuthGuard } from "@nestjs/passport";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { User } from "src/common/entities/user.entity";
import { ChangeAccountInformationDto } from "./dtos/change-account-information.dto";

@Controller("user/settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post("account")
  changeAccountInformation(
    @AuthUser() user: User,
    @Body() changeAccountInformationDto: ChangeAccountInformationDto,
  ) {
    return this.settingsService.changeAccountInformation(
      user.id,
      changeAccountInformationDto,
    );
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("account/password")
  changePassword(
    @AuthUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.settingsService.changePassword(user.id, changePasswordDto);
  }
}
