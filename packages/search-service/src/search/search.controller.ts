import { Controller, Get, Query } from "@nestjs/common";
import { ProgramsSearchService } from "./services/programs-search.service";
import { DiscussionsSearchService } from "./services/discussions-search.service";
import { ProgramsSearchQueryDto } from "./dtos/programs-search-query.dto";
import { DiscussionsSearchQueryDto } from "./dtos/discussions-search-query.dto";

@Controller("search")
export class SearchController {
  constructor(
    private readonly programsSearchService: ProgramsSearchService,
    private readonly discussionsSearchService: DiscussionsSearchService,
  ) {}

  @Get("programs")
  searchPrograms(@Query() query: ProgramsSearchQueryDto) {
    return this.programsSearchService.search(query);
  }

  @Get("discussions")
  searchDiscussions(@Query() query: DiscussionsSearchQueryDto) {
    return this.discussionsSearchService.search(query);
  }
}
