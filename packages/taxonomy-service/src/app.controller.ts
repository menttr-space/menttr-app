import { Controller, Get, Param, Query } from "@nestjs/common";
import { SkillService } from "./services/skill.service";

@Controller("taxonomy")
export class AppController {
  constructor(private readonly skillService: SkillService) {}

  @Get("skills")
  findSkillsByIds(@Query("ids") ids?: string) {
    if (ids) {
      return this.skillService.findByIds(ids.split(","));
    }
    return this.skillService.findAll();
  }

  @Get("skills/:id")
  findSkill(@Param("id") id: string) {
    return this.skillService.findById(id);
  }
}
