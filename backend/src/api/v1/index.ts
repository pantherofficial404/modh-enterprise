// Libraries
import Compose from 'koa-compose';
import Router from 'koa-router';

// Project files
import { IController } from '@app/types';
import InfoController from '@app/api/v1/controllers/info.controller';
import AuthController from '@app/api/v1/controllers/auth.controller';
import UserController from '@app/api/v1/controllers/user.controller';
import ProductController from '@app/api/v1/controllers/product.controller';
import CategoryController from '@app/api/v1/controllers/category.controller';
import { AuthMiddleware } from '@app/middlewares';

const publicRouter = new Router();
const privateRouter = new Router();

privateRouter.use(AuthMiddleware);

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
      case 'PUT':
        routeRegisterHandler = router.put;
        break;
      case 'PATCH':
        routeRegisterHandler = router.patch;
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
setControllerRoutes(privateRouter, UserController);
setControllerRoutes(privateRouter, ProductController);
setControllerRoutes(privateRouter, CategoryController);

export default Compose([
  publicRouter.routes(),
  publicRouter.allowedMethods(),
  privateRouter.routes(),
  privateRouter.allowedMethods(),
]);