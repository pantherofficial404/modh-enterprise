// Libraries
import Compose from 'koa-compose';
import Router from 'koa-router';

// Project files
import { IController } from '@app/types';
import InfoController from './controllers/info.controller';
import AuthController from './controllers/auth.controller';

const publicRouter = new Router();
const privateRouter = new Router();

const setControllerRoutes = (router: Router, controller: IController) => {
  controller.routes.forEach(x => {
    let routeRegisterHandler: any = null;
    switch (x.method) {
      case 'GET':
        routeRegisterHandler = router.get;
        break;
      case 'POST':
        routeRegisterHandler = router.post;
        break;
      case 'DELETE':
        routeRegisterHandler = router.delete;
        break;
    }

    if (routeRegisterHandler) {
      if (x.middleware) {
        routeRegisterHandler.call(router, x.path, x.middleware, x.handler);
      } else {
        routeRegisterHandler.call(router, x.path, x.handler);
      }
    }
  });
};

setControllerRoutes(publicRouter, InfoController);
setControllerRoutes(publicRouter, AuthController);

export default Compose([
  publicRouter.routes(),
  publicRouter.allowedMethods(),
  privateRouter.routes(),
  privateRouter.allowedMethods(),
]);