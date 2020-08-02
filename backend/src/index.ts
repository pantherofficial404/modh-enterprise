// Libraries
import Koa from 'koa';
import Cors from '@koa/cors';
import Config from 'config';
import Mongoose from 'mongoose';
import BodyParser from 'koa-bodyparser';
import Mount from 'koa-mount';

// Project files
import { LoggerService } from '@app/services';
import { ErrorMiddleware, NotFoundMiddleware } from '@app/middlewares';
import ApiV1 from '@app/api/v1';

const debug = new LoggerService('app:index');

(async () => {
  try {

    const DB_PATH = process.env.DB_PATH || Config.get('DB_PATH');
    debug.log(`Connecting to db ${DB_PATH}`);
    await Mongoose.connect(DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true });
    debug.log(`Server is connected to ${DB_PATH}`);

    const server = new Koa();
    server.use(Cors());
    server.use(BodyParser());
    server.use(ErrorMiddleware);
    server.use(Mount('/api/v1', ApiV1));
    server.use(NotFoundMiddleware);

    const PORT = process.env.PORT || Config.get('PORT');
    server.listen(PORT);
    debug.log(`Server is running on ${PORT}`);

  } catch (err) {
    debug.error(`Server startup failed ${err.message}`);
  }
})();