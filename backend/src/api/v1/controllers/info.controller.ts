// Libraries
import Koa from 'koa';

// Project files
import { IController, IControllerRoute } from '@app/types';
import BaseController from './base.controller';

class InfoController extends BaseController implements IController {
  constructor() {
    super();
    this.routes.push({
      method: 'POST',
      path: `/info`,
      handler: this.Info,
    });
    this.routes.push({
      method: 'GET',
      path: `/alive`,
      handler: this.Alive,
    });
  }

  public Info = async (ctx: Koa.Context) => {
    this.Ok(ctx, {
      timestamp: Date.now(),
      version: require('../../../../package.json').version,
    });
  };

  public Alive = async (ctx: Koa.Context) => {
    this.Ok(ctx, {
      timestamp: Date.now(),
    });
  };
}

export default new InfoController();