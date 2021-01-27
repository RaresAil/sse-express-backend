import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector, Router } from 'adr-express-ts';
import bodyParser from 'body-parser';
import Express from 'express';

import morgan from 'morgan';

import SSEEventsHandler from './middlewares/SSEEventsHandlerMiddleware';
import Server from './app/Server';
import { Logger } from './utils';

const expressApp = Express();

Injector.setup({
  rootFile: __filename,
  apiPrefix: '/api',
  debug: {
    log: Logger.log,
    error: Logger.error
  },
  errorHandler: undefined,
  notFoundHandler: undefined
});

Injector.inject('SSEEventsHandler', SSEEventsHandler, InjectType.Middleware);

Injector.inject(
  'Middlewares',
  [
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
    bodyParser.json(),
    bodyParser.urlencoded({ extended: false })
  ],
  InjectType.Variable
);

Injector.inject('Express', expressApp, InjectType.Variable);

Injector.inject('Server', Server);
Injector.inject('Router', Router);

Injector.ready();

export default expressApp;
