import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import SSEDomain from '../domain/SSEDomain';
import Constants from '../utils/Constants';

@Inject
export default class SSEEventsHandlerMiddleware implements Middleware {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  @Retrive('Configuration')
  private config?: Configuration;

  public async middleware(req: Request, res: Response): Promise<any> {
    const clientId = (req.cookies ?? {})[Constants.SESSION_NAME]?.id;

    if (!clientId || !mongoose.isValidObjectId(clientId)) {
      return res.status(401).end();
    }

    const id = mongoose.Types.ObjectId(clientId);
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache'
    });

    const { responseId } = await this.doamin!.createClient(res, id);

    this.doamin!.sendEventsToSingle(this.doamin!.Nests, id.toHexString());

    req.on('close', () => {
      this.config!.debug.log!(`${id} Connection closed`);
      this.doamin!.removeResponse(id.toHexString(), responseId);
    });
  }
}
