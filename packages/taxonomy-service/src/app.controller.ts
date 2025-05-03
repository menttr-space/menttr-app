import { Controller, Get, Param, Query } from "@nestjs/common";
import { SpecializationService } from "./services/specialization.service";
import { SkillService } from "./services/skill.service";

@Controller("taxonomy")
export class AppController {
  constructor(
    private readonly skillService: SkillService,
    private readonly specializationService: SpecializationService,
  ) {}

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

  @Get("specializations")
  findSpecializations(@Query("ids") ids?: string) {
    if (ids) {
      return this.specializationService.findByIds(ids.split(","));
    }
    return this.specializationService.findAll();
  }

  @Get("specializations/:id")
  findSpecialization(@Param("id") id: string) {
    return this.specializationService.findById(id);
  }
}
