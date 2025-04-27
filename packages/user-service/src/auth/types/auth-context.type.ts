import { User } from "src/common/entities/user.entity";
import { Role } from "src/common/enums/role.enum";

export type AuthContext = {
  user: User | undefined;
};

export type JwtPayload = {
  sub: string;
  jti?: string;
  username: string;
  role: Role;
};
