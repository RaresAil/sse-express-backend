import { Action, Get, Retrive, Response, Put, Request } from 'adr-express-ts';
import { Response as EResponse, Request as ERequest } from 'express';

import SSEResponder from '../../responders/SSEResponder';
import SSEDomain from '../../domain/SSEDomain';
import Constants from '../../utils/Constants';

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
    const clients = this.doamin!.Clients.length;
    this.responder!.sendClients(res, clients);
  }

  @Put('/quantity/:id')
  public setTotal(@Request req: ERequest, @Response res: EResponse) {
    const clientId = (req.cookies ?? {})[Constants.SESSION_NAME]?.id;
    const client = this.doamin!.Clients.find(
      ({ id }) => id === parseInt(clientId?.toString())
    );

    const nest = this.doamin!.Nests.find(
      ({ id }) => id === parseInt(req.params?.id?.toString())
    );

    if (!client || !nest) {
      return this.responder!.unauthorized(res);
    }

    const quantityValue = parseInt(req.body.quantity);
    if (
      Number.isNaN(quantityValue) ||
      !Number.isFinite(quantityValue) ||
      quantityValue < 0
    ) {
      return this.responder!.badRequest(
        res,
        'The quantity has to be a finite number and grater or equal than 0'
      );
    }

    let quantityOptions = [...client.options.quantity];
    const search = quantityOptions.findIndex(({ item }) => item === nest.id);

    if (search >= 0) {
      quantityOptions[parseInt(search.toString())].value = quantityValue;
    } else {
      quantityOptions = [
        ...quantityOptions,
        {
          item: nest.id,
          value: quantityValue
        }
      ];
    }

    this.doamin!.updateClientOptions(client.id, {
      ...client.options,
      quantity: quantityOptions
    });

    this.doamin!.sendEventsToSingle(nest, client);
    this.responder!.noContent(res);
  }
}
