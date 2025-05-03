import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { IndexingModule } from "./indexing/indexing.module";
import { SearchModule } from "./search/search.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    IndexingModule,
    SearchModule,
  ],
})
export class AppModule {}
