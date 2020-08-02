// Libraries
import Koa from 'koa';

// Project files
import { LoggerService } from '@app/services';
import { STATUS_CODE } from '@app/constants';

const debug = new LoggerService('app:error_middleware');

const errorMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  try {
    await next();
  } catch (e) {
    const status = e.status || STATUS_CODE['Internal Server Error'];
    const message = status === STATUS_CODE['Internal Server Error'] ? 'Internal server error' : e.message || 'Unknown';

    if (status === STATUS_CODE['Internal Server Error']) {
      debug.error(e);
    }

    ctx.status = status;
    ctx.body = {
      errorCode: status,
      message,
      path: ctx.path,
      success: false,
    };
  }
};

export default errorMiddleware;