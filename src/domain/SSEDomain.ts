import { Inject, Domain } from 'adr-express-ts';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

import { Client, Nest } from '../@types/SSE';
import { SSE } from '../utils';

@Inject
@Domain('SSE')
export default class SSEDomain {
  private clients: Client[] = [];
  private nests: Nest[] = [];

  public get ClientsLength() {
    return this.clients.length;
  }

  public get Nests() {
    return cloneDeep(this.nests);
  }

  public createClient(res: Response) {
    const client: Client = {
      id: Date.now(),
      res
    };

    this.clients = [...this.clients, client];
    return client;
  }

  public deleteClient(id: number) {
    this.clients = this.clients.filter(({ id: cid }) => cid !== id);
  }

  public createNest(nest: Nest) {
    this.nests = [...this.nests, cloneDeep(nest)];
    return nest;
  }

  public replaceNests(nests: Nest[]) {
    this.nests = nests.map((nest) => cloneDeep(nest));
    return nests;
  }

  public sendEventsToAll(nests: Nest | Nest[]) {
    return this.clients.map((client) =>
      client.res.write(SSE.nestToData(nests))
    );
  }
}
