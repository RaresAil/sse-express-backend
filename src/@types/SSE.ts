import { Response } from 'express';

export interface ClientOptionsQuantity {
  item: number;
  value: number;
}

export interface ClientOptions {
  quantity: ClientOptionsQuantity[];
}

export interface Client {
  responses: Response[];
}

export interface Clients {
  [key: string]: Client;
}

export interface Nest {
  id: number;
  country: string;
  code: string;
  currency: string;
  level: number;
  units: string;
  total: number;
  quantity?: number;
}
