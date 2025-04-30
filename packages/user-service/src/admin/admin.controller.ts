import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "src/common/decorators/roles.decorator";
import { Role } from "src/common/enums/role.enum";
import { RolesGuard } from "src/common/guards/roles.guard";

@UseGuards(AuthGuard("jwt"), RolesGuard)
@Roles(Role.Admin)
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get("applications")
  getPendingApplications() {
    return this.adminService.getPendingApplications();
  }

  @Post("applications/:userId/approve")
  approveMentor(@Param("userId") userId: string) {
    return this.adminService.approveApplication(userId);
  }

  @Post("applications/:userId/reject")
  rejectMentor(@Param("userId") userId: string) {
    return this.adminService.rejectApplication(userId);
  }
}
