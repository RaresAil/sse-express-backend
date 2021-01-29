import { Configuration, Inject, Retrive } from 'adr-express-ts';
import { InjectedClass } from 'adr-express-ts/lib/@types';
import { Application } from 'express';
import mongoose from 'mongoose';

@Inject
export default class Server implements InjectedClass {
  @Retrive('Express')
  private application?: Application;

  @Retrive('Configuration')
  private config?: Configuration;

  public async onReady(): Promise<void> {
    try {
      if (!this.application || !this.config) {
        return;
      }

      const log = this.config.debug.log!;

      const env = process.env as any;

      mongoose.connect(
        'mongodb+srv://tsaccess:tsaccess@maincluster.nqcin.mongodb.net/sse?retryWrites=true&w=majority',
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true
        }
      );

      this.application.listen(4000, env.HOST, async () => {
        this.application!.emit('ready', true);
        log('Server started %o', `${env.HOST}:4000`);
      });
    } catch (e) {
      this.config?.debug.error!(e);
    }
  }
}
