import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthContext } from "src/auth/types/auth-context.type";

interface AuthenticatedRequest extends Request, AuthContext {}

export const AuthUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

  if (!request.user) {
    throw new UnauthorizedException();
  }

  return request.user;
});
