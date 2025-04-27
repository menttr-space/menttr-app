import { Controller } from "@nestjs/common";

@Controller()
export class ProgramsController {
  constructor(private readonly programsController: ProgramsController) {}
}
