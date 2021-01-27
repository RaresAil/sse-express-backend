import { Inject, Retrive } from 'adr-express-ts';

import SSEDomain from '../domain/SSEDomain';
import { Nest } from '../@types/SSE';

@Inject
export default class TestApp {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  public createNest(nest: Nest) {
    const createdNest = this.doamin!.createNest(nest);
    this.doamin!.sendEventsToAll(createdNest);
  }
}
