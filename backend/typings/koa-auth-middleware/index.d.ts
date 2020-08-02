// Project files
import { IUserRole } from "@app/types";

interface IAuth {
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: number;
  roles: IUserRole[];
  isVerified: boolean;
  expiresIn: number;
}

declare module "koa" {
  interface Request {
    auth: IAuth;
  }
}