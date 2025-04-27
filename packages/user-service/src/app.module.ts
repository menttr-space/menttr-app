import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TypeORMModule } from "./database/typeorm.module";
import { ConfigModule } from "@nestjs/config";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeORMModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
