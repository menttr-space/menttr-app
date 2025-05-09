import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IndexingModule } from "./indexing/indexing.module";
import { SearchModule } from "./search/search.module";
import { FeedModule } from "./feed/feed.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IndexingModule,
    SearchModule,
    FeedModule,
  ],
})
export class AppModule {}
