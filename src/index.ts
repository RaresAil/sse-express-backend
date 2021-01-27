import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector, Router } from 'adr-express-ts';
import bodyParser from 'body-parser';
import Express from 'express';

import morgan from 'morgan';
// import mongoose from 'mongoose';

import SSEEventsHandler from './middlewares/SSEEventsHandlerMiddleware';
import Server from './app/Server';
import { Logger } from './utils';

const expressApp = Express();

Injector.setup({
  root: __dirname,
  apiPrefix: '/api',
  debug: {
    log: Logger.log,
    error: Logger.error
  },
  errorHandler: undefined,
  notFoundHandler: undefined
});

// Injector.inject('MongooseConfig', { connectionURL: '' }, InjectType.Variable);
// Injector.inject('Mongoose', mongoose, InjectType.Variable);

Injector.inject('SSEEventsHandler', SSEEventsHandler, InjectType.Middleware);

Injector.inject(
  'Middlewares',
  [
    morgan('dev'),
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
