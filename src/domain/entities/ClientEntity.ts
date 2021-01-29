import { InjectedEntity } from 'adr-express-ts/lib/@types';
import { Inject, Entity } from 'adr-express-ts';

import mongoose from 'mongoose';

@Inject
@Entity('Client')
export default class ClientEntity implements InjectedEntity {
  async onLoad(): Promise<void> {
    const { ObjectId } = mongoose.Schema as any;

    const QuantitySchema = new mongoose.Schema(
      {
        item: {
          type: Number,
          required: true
        },
        value: {
          type: Number,
          required: true
        }
      },
      {
        _id: false
      }
    );

    mongoose.model(
      'Client',
      new mongoose.Schema({
        _id: {
          type: ObjectId,
          required: true
        },
        options: {
          quantity: [QuantitySchema]
        }
      })
    );
  }
}
