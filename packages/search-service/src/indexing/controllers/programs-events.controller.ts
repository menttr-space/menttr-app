import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { ProgramsIndexingService } from "../services/programs-indexing.service";

@Controller()
export class ProgramsIndexingController {
  constructor(
    private readonly programsIndexingService: ProgramsIndexingService,
  ) {}

  @EventPattern("program.created")
  async onProgramCreated(@Payload() { id, ...data }: any) {
    await this.programsIndexingService.index("programs", id, data);
  }

  @EventPattern("program.updated")
  async onProgramUpdated(@Payload() { id, ...data }: any) {
    await this.programsIndexingService.update("programs", id, data);
  }

  @EventPattern("program.enrollment.closed")
  async onProgramEnrollmentClosed(@Payload() { id }: any) {
    await this.programsIndexingService.delete("programs", id);
  }
}
