import { Response } from 'express';

export interface Client {
  id: number;
  res: Response;
}

export interface Nest {
  [key: string]: any;
}
