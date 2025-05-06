import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ProgramsIndexingService } from "../services/programs-indexing.service";

@Controller()
export class ProgramsIndexingController {
  constructor(
    private readonly programsIndexingService: ProgramsIndexingService,
  ) {}

  @EventPattern("program.created")
  async onProgramCreated(@Payload() data: any) {
    await this.programsIndexingService.index(data.id, data);
  }

  @EventPattern("program.updated")
  async onProgramUpdated(@Payload() data: any) {
    await this.programsIndexingService.update(data.id, data);
  }

  @EventPattern("program.enrollment.closed")
  async onProgramEnrollmentClosed(@Payload() { id }: any) {
    await this.programsIndexingService.delete(id);
  }
}
