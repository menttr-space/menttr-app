import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, context: ExecutionContext): any {
    // If there's no user, just continue without throwing
    return user || null;
  }
}
