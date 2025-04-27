import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashingService {
  salt: number;

  constructor(private readonly configService: ConfigService) {
    this.salt = +this.configService.getOrThrow<number>("BCRYPT_SALT_ROUNDS");
  }

  async hash(data: string) {
    return await bcrypt.hash(data, this.salt);
  }

  async compare(data: string, hash: string) {
    return await bcrypt.compare(data, hash);
  }
}
