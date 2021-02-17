import { Inject, Domain } from 'adr-express-ts';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import mongoose from 'mongoose';

import {
  ClientOptions,
  ClientOptionsQuantity,
  Clients,
  Nest
} from '../@types/SSE';
import { SSE } from '../utils';

@Inject
@Domain('SSE')
export default class SSEDomain {
  private nests: Nest[] = [];
  private clients: Clients = {};

  public get Clients(): Clients {
    return this.clients;
  }

  public get Nests() {
    return cloneDeep(this.nests);
  }

  public async createClient(res: Response, id = mongoose.Types.ObjectId()) {
    const Client = mongoose.models.Client;

    let findClient: mongoose.Document = await Client.findOne({
      _id: id
    });

    if (!findClient) {
      findClient = new Client({
        _id: id,
        options: {
          quantity: []
        }
      });
      await findClient.save();
    }

    const clientId = id.toHexString();
    let responseId: number = -1;

    if (this.clients[clientId.toString()]) {
      responseId = this.clients[clientId.toString()].responses.length;
      this.clients[clientId.toString()].responses = [
        ...this.clients[clientId.toString()].responses,
        res
      ];
    } else {
      responseId = 0;
      this.clients = {
        ...this.clients,
        [clientId]: {
          responses: [res]
        }
      };
    }

    return {
      clientId: clientId,
      responseId
    };
  }

  public async getClientOptions(
    clientId: string
  ): Promise<ClientOptions | null | undefined> {
    const Client = mongoose.models.Client;
    const findClient: mongoose.Document = await Client.findOne({
      _id: mongoose.Types.ObjectId(clientId)
    });

    return (findClient?.toObject() as any).options;
  }

  public async updateClientOptions(clientId: string, options: ClientOptions) {
    const Client = mongoose.models.Client;

    const findClient: any = await Client.findOne({
      _id: mongoose.Types.ObjectId(clientId)
    });

    if (!findClient) {
      return;
    }

    findClient.options = options;
    await findClient.save();
  }

  private deleteClient(id: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: _, ...clients } = this.clients;
    this.clients = clients;
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

  public removeResponse = (clientId: string, responseId: number) => {
    this.clients[clientId.toString()].responses = this.clients[
      clientId.toString()
    ].responses.filter((_, id) => {
      return id !== responseId;
    });

    if (this.clients[clientId.toString()].responses.length <= 0) {
      this.deleteClient(clientId);
    }
  };

  public async sendEventsToSingle(nests: Nest | Nest[], clientId: string) {
    const client = this.clients[clientId.toString()];

    if (!client) {
      return null;
    }

    const clientOptions = await this.getClientOptions(clientId);
    if (!clientOptions) {
      return null;
    }

    let parsedNests = cloneDeep(nests);

    if (Array.isArray(parsedNests)) {
      parsedNests = parsedNests.map((nest) => ({
        ...nest,
        total: nest.level * this.getQuantity(nest, clientOptions.quantity),
        quantity: this.getQuantity(nest, clientOptions.quantity)
      }));
    } else {
      parsedNests = {
        ...parsedNests,
        total:
          parsedNests.level *
          this.getQuantity(parsedNests, clientOptions.quantity),
        quantity: this.getQuantity(parsedNests, clientOptions.quantity)
      };
    }

    return client.responses.map((res, responseId) => {
      try {
        return res.write(SSE.nestToData(parsedNests));
      } catch {
        this.removeResponse(clientId, responseId);
        return null;
      }
    });
  }

  public async sendEventsToAll(nests: Nest | Nest[]) {
    return await Promise.all(
      Object.keys(this.clients).map(async (clientId) => {
        const client = this.clients[clientId.toString()];

        const clientOptions = await this.getClientOptions(clientId);
        if (!clientOptions) {
          return null;
        }

        let parsedNests = cloneDeep(nests);

        if (Array.isArray(parsedNests)) {
          parsedNests = parsedNests.map((nest) => ({
            ...nest,
            total: nest.level * this.getQuantity(nest, clientOptions.quantity),
            quantity: this.getQuantity(nest, clientOptions.quantity)
          }));
        } else {
          parsedNests = {
            ...parsedNests,
            total:
              parsedNests.level *
              this.getQuantity(parsedNests, clientOptions.quantity),
            quantity: this.getQuantity(parsedNests, clientOptions.quantity)
          };
        }

        return client.responses.map((res, responseId) => {
          try {
            return res.write(SSE.nestToData(parsedNests));
          } catch {
            this.removeResponse(clientId, responseId);
            return null;
          }
        });
      })
    );
  }
}
