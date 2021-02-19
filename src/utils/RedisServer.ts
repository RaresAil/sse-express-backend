import { Configuration, Inject, Retrive } from 'adr-express-ts';
import redis, { RedisClient, ClientOpts } from 'redis';

import SSEDomain from '../domain/SSEDomain';

@Inject
export default class RedisServer {
  @Retrive('Configuration')
  private config?: Configuration;

  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  private receiver: RedisClient;
  private sender: RedisClient;

  constructor() {
    const clientOptions: ClientOpts = {
      prefix: 'sse-clients:'
    };

    this.receiver = redis.createClient(clientOptions);
    this.sender = redis.createClient(clientOptions);

    this.receiver.once('connect', this.onRedisConnect);
  }

  private onRedisConnect = async () => {
    const log = this.config!.debug.log!;
    log('Connected to the redis server');

    this.receiver.on('subscribe', (channel, count) => {
      log(
        'Client connected to the redis server',
        channel,
        'number of connected clients',
        count
      );
    });
    this.receiver.on('unsubscribe', (channel, count) => {
      log(
        'Client disconnected from the redis server',
        channel,
        'number of connected clients',
        count
      );
    });
    this.receiver.on('message', this.onMessageReceived);
  };

  private onMessageReceived = (client: string, message: string) => {
    this.doamin!.writeDataToClient(client, message);
  };

  public sendMessageToClient = async (client: string, message: string) =>
    new Promise((resolve, reject) =>
      this.sender.publish(client, message, (err, reply) => {
        if (err) {
          return reject(err);
        }

        return resolve(reply);
      })
    );

  public connectClient = async (client: string) =>
    new Promise((resolve, reject) =>
      this.receiver.subscribe(client, (err, reply) => {
        if (err) {
          return reject(err);
        }

        return resolve(reply);
      })
    );

  public disconnectClient = async (client: string) =>
    new Promise((resolve, reject) =>
      this.receiver.unsubscribe(client, (err, reply) => {
        if (err) {
          return reject(err);
        }

        return resolve(reply);
      })
    );
}
