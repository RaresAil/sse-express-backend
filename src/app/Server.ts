import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { InjectedClass } from 'adr-express-ts/lib/@types';
import { Application } from 'express';

import { Mongoose } from 'mongoose';

@Inject
export default class Server implements InjectedClass {
  @Retrive('Express')
  private application?: Application;

  @Retrive('Configuration')
  private config?: Configuration;

  @Retrive('Mongoose')
  private mongoose?: Mongoose;

  @Retrive('MongooseConfig')
  private mongooseConfig?: any;

  public async onReady(): Promise<void> {
    try {
      if (!this.application || !this.config) {
        return;
      }

      const log = this.config.debug.log!;

      if (
        this.mongooseConfig?.connectionURL &&
        this.mongooseConfig?.connectionURL.trim() !== ''
      ) {
        await this.mongoose?.connect(this.mongooseConfig?.connectionURL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        });
        log('Mongoose Connected');
      }

      this.application.listen(4000, '0.0.0.0', async () => {
        this.application!.emit('ready', true);
        log('Server started %o', '0.0.0.0:4000');
      });
    } catch (e) {
      this.config?.debug.error!(e);
    }
  }
}
