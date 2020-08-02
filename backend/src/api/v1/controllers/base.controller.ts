// Libraries
import Koa from 'koa';

// Project files
import { IController, IControllerRoute, IResponseData } from '@app/types';
import { STATUS_CODE, ERROR_CODE } from '@app/constants';

class BaseController implements IController {
  public routes: IControllerRoute[] = [];
  protected Ok<T, M = any>(
    ctx: Koa.Context,
    data: T,
    message?: string,
    metadata?: M,
    success: boolean = true
  ) {
    const response: IResponseData<T> = {
      success,
      message,
      data,
      metadata,
    };
    ctx.status = STATUS_CODE.Ok;
    ctx.body = response;
  }

  protected Created<T, M = any>(
    ctx: Koa.Context,
    data: T,
    message?: string,
    metadata?: M
  ) {
    const response: IResponseData<T> = {
      success: true,
      message,
      data,
      metadata,
    };
    ctx.status = STATUS_CODE.Created;
    ctx.body = response;
  }

  protected NoContent<M = any>(
    ctx: Koa.Context,
    message?: string,
    metadata?: M
  ) {
    const response: IResponseData<null> = {
      success: true,
      message,
      metadata,
    };
    ctx.status = STATUS_CODE['No Content'];
    ctx.body = response;
  }

  protected NotFound<M = any>(
    ctx: Koa.Context,
    message?: string,
    errorCode?: ERROR_CODE,
    metadata?: M
  ) {
    const response: IResponseData<null> = {
      success: false,
      message: message || 'Not found',
      errorCode,
      metadata,
    };
    ctx.status = STATUS_CODE['Not Found'];
    ctx.body = response;
  }

  protected BadRequest<M = any>(
    ctx: Koa.Context,
    message?: string,
    errorCode?: ERROR_CODE,
    metadata?: M
  ) {
    const response: IResponseData<null> = {
      success: false,
      message: message || 'Bad request',
      errorCode,
      metadata,
    };
    ctx.status = STATUS_CODE['Bad Request'];
    ctx.body = response;
  }

  protected UnAuthorized<M = any>(
    ctx: Koa.Context,
    message?: string,
    errorCode?: ERROR_CODE,
    metadata?: M
  ) {
    const response: IResponseData<null> = {
      success: false,
      message: message || 'Unauthorized',
      errorCode,
      metadata,
    };

    ctx.body = STATUS_CODE.Unauthorized;
    ctx.body = response;
  }

  protected Forbidden<M = any>(
    ctx: Koa.Context,
    message?: string,
    errorCode?: ERROR_CODE,
    metadata?: M
  ) {
    const response: IResponseData<null> = {
      success: false,
      message: message || 'Forbidden',
      errorCode,
      metadata,
    };

    ctx.body = STATUS_CODE.Forbidden;
    ctx.body = response;
  }
}

export default BaseController;