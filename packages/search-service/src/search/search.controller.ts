import { Controller, Get, Query } from "@nestjs/common";
import { SearchService } from "./search.service";
import { SearchQueryDto } from "./dtos/search-query.dto";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("programs")
  searchPrograms(@Query() query: SearchQueryDto) {
    return this.searchService.searchPrograms(query);
  }
}
