import { Module } from "@nestjs/common";
import { ProxyModule } from "src/proxy/proxy.module";

@Module({
  imports: [ProxyModule],
})
export class AppModule {}
