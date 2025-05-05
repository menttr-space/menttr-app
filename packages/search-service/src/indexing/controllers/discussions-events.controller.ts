import { Controller } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { DiscussionsIndexingService } from "../services/discussions-indexing.service";

@Controller()
export class DiscussionsIndexingController {
  constructor(
    private readonly discussionsIndexingService: DiscussionsIndexingService,
  ) {}

  @EventPattern("discussion.created")
  async onProgramCreated(@Payload() data: any) {
    await this.discussionsIndexingService.index(data.id, data);
  }

  @EventPattern("discussion.updated")
  async onProgramUpdated(@Payload() data: any) {
    await this.discussionsIndexingService.update(data.id, data);
  }
}
