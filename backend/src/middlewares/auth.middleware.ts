// Libraries
import Koa from 'koa';
import Config from 'config';
import JWT from 'jsonwebtoken';

// Project files
import { STATUS_CODE } from '@app/constants';

const authMiddleware = async (ctx: Koa.Context, next: () => Promise<any>) => {
  const authorization = ctx.get('Authorization');
  let token: string;
  let authInfo: any;
  if (authorization) {
    token = authorization.replace(/^bearer /gi, '');
  }

  if (token) {
    try {
      authInfo = JWT.verify(token, process.env.JWT_SECRET || Config.get('JWT_SECRET'));
    } catch {
      ctx.status = STATUS_CODE.Unauthorized;
      ctx.body = {
        code: STATUS_CODE.Unauthorized,
        message: 'Unauthorized request',
        path: ctx.path,
        success:false,
      };
      return;
    }
  }

  if (authInfo && Date.now() > authInfo.expiredOn) {
    ctx.status = STATUS_CODE.Unauthorized;
    ctx.body = {
      code: STATUS_CODE.Unauthorized,
      message: 'Unauthorized request',
      path: ctx.path,
    };
    return;
  }

  if (!authInfo) {
    ctx.status = STATUS_CODE.Unauthorized;
    ctx.body = {
      code: STATUS_CODE.Unauthorized,
      message: 'Unauthorized request',
      path: ctx.path,
    };
    return;
  }

  ctx.request.auth = authInfo;

  await next();
};

export default authMiddleware;