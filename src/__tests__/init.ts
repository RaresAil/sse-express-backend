import EventSource from 'eventsource';
import chaiHttp from 'chai-http';
import mocha from 'mocha';
import chai from 'chai';

import { InjectType } from 'adr-express-ts/lib/@types';
import { Injector } from 'adr-express-ts';
import TestApp from './TestApp';
import app from '../index';

chai.use(chaiHttp);

// Inject the Test Application
Injector.inject('Test.App', TestApp, InjectType.Class);

export let events: EventSource | undefined;

let isAppReady = false;
app.on('ready', () => {
  isAppReady = true;
});

const eventsUrl = 'http://localhost:4000/api/v1/sse/events';

mocha.before((done) => {
  if (isAppReady) {
    events = new EventSource(eventsUrl);
    return done();
  }

  app.on('ready', () => {
    events = new EventSource(eventsUrl);
    done();
  });
});
