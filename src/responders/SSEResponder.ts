import { Inject, Responder } from 'adr-express-ts';
import { Response } from 'express';

@Inject
@Responder('SSE')
export default class SSEResponder {
  public sendClients(res: Response, clients: number) {
    return res.status(200).json({
      success: true,
      clients
    });
  }

  public unauthorized(res: Response) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  public noContent(res: Response) {
    return res.status(204).end();
  }

  public badRequest(res: Response, message: string) {
    return res.status(400).json({
      success: false,
      message
    });
  }
}
