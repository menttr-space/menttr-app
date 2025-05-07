import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthContext } from "./auth-context.type";

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthContext>();

  if (!request.user) {
    throw new UnauthorizedException();
  }

  return request.user;
});
