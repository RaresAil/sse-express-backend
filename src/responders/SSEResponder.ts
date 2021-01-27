import { Inject, Responder } from 'adr-express-ts';
import { Response } from 'express';

import { Nest } from '../@types/SSE';

@Inject
@Responder('SSE')
export default class SSEResponder {
  public sendClients(res: Response, clients: number) {
    return res.status(200).json({
      success: true,
      clients
    });
  }

  public sendNest(res: Response, nest: Nest) {
    return res.status(201).json(nest);
  }
}
