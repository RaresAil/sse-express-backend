import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Request, Response } from 'express';

import SSEDomain from '../domain/SSEDomain';
import Constants from '../utils/Constants';

@Inject
export default class SSEEventsHandlerMiddleware implements Middleware {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  @Retrive('Configuration')
  private config?: Configuration;

  public async middleware(req: Request, res: Response): Promise<any> {
    const id = Date.now();
    res
      .cookie(
        Constants.SESSION_NAME,
        {
          id
        },
        {
          httpOnly: true
        }
      )
      .writeHead(200, {
        'Content-Type': 'text/event-stream',
        Connection: 'keep-alive',
        'Cache-Control': 'no-cache'
      });

    const client = this.doamin!.createClient(res, id);

    this.doamin!.sendEventsToSingle(this.doamin!.Nests, client);

    req.on('close', () => {
      this.config!.debug.log!(`${id} Connection closed`);
      this.doamin!.deleteClient(id);
    });
  }
}
