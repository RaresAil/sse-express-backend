import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { Middleware } from 'adr-express-ts/lib/@types';
import { Request, Response } from 'express';

import SSEDomain from '../domain/SSEDomain';
import { SSE } from '../utils';

@Inject
export default class SSEEventsHandlerMiddleware implements Middleware {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  @Retrive('Configuration')
  private config?: Configuration;

  public async middleware(req: Request, res: Response): Promise<any> {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
      'Cache-Control': 'no-cache'
    });

    res.write(SSE.nestToData(this.doamin!.Nests));

    const clientId = this.doamin!.createClient(res).id;

    req.on('close', () => {
      this.config!.debug.log!(`${clientId} Connection closed`);
      this.doamin!.deleteClient(clientId);
    });
  }
}
