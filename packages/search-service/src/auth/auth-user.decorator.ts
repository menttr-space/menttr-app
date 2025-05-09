import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthContext } from "./auth-context.type";

type Options = {
  optional?: boolean;
};

export const AuthUser = createParamDecorator(
  (options: Options = {}, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthContext>();
    const { optional = false } = options;

    if (!request.user) {
      if (optional) return request;
      throw new UnauthorizedException();
    }

    return request.user;
  },
);
