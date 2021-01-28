import { Response } from 'express';

export interface Client {
  id: number;
  res: Response;
}

export interface Nest {
  country: string;
  code: string;
  currency: string;
  level: number;
  units: string;
}
