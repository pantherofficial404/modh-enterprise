// Project files
import Koa from 'koa';

// Project files
import { STATUS_CODE } from '@app/constants';

const notFoundHandler = async (ctx: Koa.Context) => {
  if (ctx.path === '/alive') {
    ctx.body = {
      status: 'ok',
      timestamp: Date.now(),
    };
    return;
  }

  ctx.status = STATUS_CODE['Not Found'];
  ctx.body = {
    errorCode: STATUS_CODE['Not Found'],
    message: 'Requested path not found',
    path: ctx.path,
    success: false,
  };
};

export default notFoundHandler;