import { Action, Get, Retrive, Response } from 'adr-express-ts';
import { Response as EResponse } from 'express';

import SSEResponder from '../../responders/SSEResponder';
import SSEDomain from '../../domain/SSEDomain';

@Action('/sse')
export default class SSEAction {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  @Retrive('Responder.SSE')
  private responder?: SSEResponder;

  @Get('/events', ['SSEEventsHandler'])
  public getEvents() {}

  @Get('/status')
  public getStatus(@Response res: EResponse) {
    const clients = this.doamin!.ClientsLength;
    this.responder!.sendClients(res, clients);
  }
}
