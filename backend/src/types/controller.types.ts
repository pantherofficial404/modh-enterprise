// Libraries
import Koa from 'koa';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
export interface IControllerRoute {
  method: HttpMethod;
  path: string;
  handler: (ctx: Koa.Context) => Promise<void>;
  middleware?: Koa.Middleware | Koa.Middleware[];
}

export interface IController {
  routes: IControllerRoute[];
}

export interface IResponseData<T, M = any> {
  success: boolean;
  message?: string;
  data?: T;
  errorCode?: number;
  metadata: M;
}
