import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector, Router } from 'adr-express-ts';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import Express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import SSEEventsHandler from './middlewares/SSEEventsHandlerMiddleware';
import RedisServer from './utils/RedisServer';
import Server from './app/Server';
import { Logger } from './utils';
import SSE from './app/SSE';

const expressApp = Express();

Injector.setup({
  rootFile: __filename,
  apiPrefix: '/api',
  debug: {
    log: Logger.log,
    error: Logger.error
  },
  staticFiles: {
    path: '/',
    directory: ['public']
  }
});

Injector.inject('SSEEventsHandler', SSEEventsHandler, InjectType.Middleware);

Injector.inject(
  'Middlewares',
  [
    cors(),
    morgan(function (tokens, req, res) {
      Logger.routeLog(
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'),
        '-',
        tokens['response-time'](req, res),
        'ms'
      );

      return null;
    }),
    cookieParser(),
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false })
  ],
  InjectType.Variable
);

Injector.inject('Express', expressApp, InjectType.Variable);

Injector.inject('RedisServer', RedisServer);
Injector.inject('SSE', SSE);
Injector.inject('Server', Server);
Injector.inject('Router', Router);

Injector.ready();

export default expressApp;
