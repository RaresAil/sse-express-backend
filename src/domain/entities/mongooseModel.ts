// import { Inject, InjectedEntity, Retrive, Entity } from 'adr-express-ts';
// import { Schema, Mongoose } from 'mongoose';

// @Inject
// @Entity('MongooseModelName')
// export default class MongooseModelName implements InjectedEntity {
//   // Mongoose must be injected first!
//   // e.g. Injector.inject('Mongoose', mongoose, InjectType.Variable);
//   @Retrive('Mongoose')
//   private mongoose?: Mongoose;

//   async onLoad (): Promise<void> {
//     if (!this.mongoose) {
//       return;
//     }

//     const { ObjectId } = Schema as any;

//     this.mongoose.model('ModelName', new Schema({
//       id: ObjectId,
//       name: {
//         type: String,
//         min: 3,
//         max: 255,
//         required: true
//       }
//     }));
//   }
// }
