import { Action, Get, Retrive, Response, Put, Request } from 'adr-express-ts';
import { Response as EResponse, Request as ERequest } from 'express';

import SSEResponder from '../../responders/SSEResponder';
import SSEDomain from '../../domain/SSEDomain';
import Constants from '../../utils/Constants';
import mongoose from 'mongoose';

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
    const clients = Object.keys(this.doamin!.Clients).length;
    this.responder!.sendClients(res, clients);
  }

  @Get('/me')
  public myId(@Request req: ERequest, @Response res: EResponse) {
    const clientId = (req.cookies ?? {})[Constants.SESSION_NAME]?.id;
    return res.json({
      success: !!clientId,
      userId: clientId ?? null
    });
  }

  @Get('/login')
  public register(@Response res: EResponse) {
    return this.responder!.login(res, mongoose.Types.ObjectId().toHexString());
  }

  @Get('/login/:id')
  public login(@Request req: ERequest, @Response res: EResponse) {
    if (!mongoose.isValidObjectId(req?.params?.id)) {
      return this.responder!.badRequest(res, 'Invalid id.');
    }

    return this.responder!.login(res, req.params.id);
  }

  @Put('/quantity/:id')
  public async setTotal(@Request req: ERequest, @Response res: EResponse) {
    const clientId = (req.cookies ?? {})[Constants.SESSION_NAME]?.id;
    const client = this.doamin!.Clients[clientId?.toString()];

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

    const options = await this.doamin!.getClientOptions(clientId);
    if (!options) {
      return this.responder!.unauthorized(res);
    }

    let quantityOptions = [...options.quantity];
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

    await this.doamin!.updateClientOptions(clientId, {
      ...options,
      quantity: quantityOptions
    });

    this.doamin!.sendEventsToSingle(nest, clientId);
    this.responder!.noContent(res);
  }
}
