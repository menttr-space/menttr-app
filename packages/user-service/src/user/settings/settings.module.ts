import { Module } from "@nestjs/common";
import { SettingsController } from "./settings.controller";
import { SettingsService } from "./settings.service";
import { JwtStrategy } from "src/auth/strategies/jwt.stragery";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { HashingService } from "src/auth/services/hashing.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [SettingsController],
  providers: [SettingsService, HashingService, JwtStrategy],
})
export class SettingsModule {}
