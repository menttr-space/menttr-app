import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/common/entities/user.entity";
import { JwtStrategy } from "src/auth/strategies/jwt.stragery";
import { ProfileService } from "./profile.service";
import { UserSkill } from "src/common/entities/user-skill.entity";
import { UserSpecialization } from "src/common/entities/user-specialization.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, UserSkill, UserSpecialization])],
  controllers: [ProfileController],
  providers: [ProfileService, JwtStrategy],
})
export class ProfileModule {}
