import { Inject, Domain } from 'adr-express-ts';
import { Response } from 'express';
import { cloneDeep } from 'lodash';

import {
  Client,
  ClientOptions,
  ClientOptionsQuantity,
  Nest
} from '../@types/SSE';
import { SSE } from '../utils';

@Inject
@Domain('SSE')
export default class SSEDomain {
  private clients: Client[] = [];
  private nests: Nest[] = [];

  public get Clients() {
    return this.clients;
  }

  public get Nests() {
    return cloneDeep(this.nests);
  }

  public createClient(res: Response, id = Date.now()) {
    const client: Client = {
      id,
      res,
      options: {
        quantity: []
      }
    };

    this.clients = [...this.clients, client];
    return client;
  }

  public updateClientOptions(clientId: number, options: ClientOptions) {
    this.clients = this.clients.map((client) => {
      if (clientId === client.id) {
        client.options = options;
      }

      return client;
    });
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

  private getQuantity = function (
    nest: Nest,
    quantity: ClientOptionsQuantity[]
  ) {
    return quantity.find(({ item }) => item === nest.id)?.value ?? 1;
  };

  public sendEventsToSingle(nests: Nest | Nest[], clientId: number | Client) {
    const client =
      typeof clientId === 'number'
        ? this.clients.find(({ id }) => id === clientId)
        : clientId;

    if (!client) {
      return null;
    }

    const quantity = client.options.quantity;
    let parsedNests = cloneDeep(nests);

    if (Array.isArray(parsedNests)) {
      parsedNests = parsedNests.map((nest) => ({
        ...nest,
        total: nest.level * this.getQuantity(nest, quantity),
        quantity: this.getQuantity(nest, quantity)
      }));
    } else {
      parsedNests = {
        ...parsedNests,
        total: parsedNests.level * this.getQuantity(parsedNests, quantity),
        quantity: this.getQuantity(parsedNests, quantity)
      };
    }

    return client.res.write(SSE.nestToData(parsedNests));
  }

  public sendEventsToAll(nests: Nest | Nest[]) {
    return this.clients.map((client) => {
      const quantity = client.options.quantity;
      let parsedNests = cloneDeep(nests);

      if (Array.isArray(parsedNests)) {
        parsedNests = parsedNests.map((nest) => ({
          ...nest,
          total: nest.level * this.getQuantity(nest, quantity),
          quantity: this.getQuantity(nest, quantity)
        }));
      } else {
        parsedNests = {
          ...parsedNests,
          total: parsedNests.level * this.getQuantity(parsedNests, quantity),
          quantity: this.getQuantity(parsedNests, quantity)
        };
      }

      return client.res.write(SSE.nestToData(parsedNests));
    });
  }
}
