import { Inject, Retrive } from 'adr-express-ts';
import SSEDomain from '../domain/SSEDomain';
import { Nest } from '../@types/SSE';
import { InjectedClass } from 'adr-express-ts/lib/@types';

@Inject
export default class SSE implements InjectedClass {
  @Retrive('Domain.SSE')
  private doamin?: SSEDomain;

  onReady(): any {
    this.replaceNests(this.generateNests());
  }

  private replaceNests(nNests: Nest[]) {
    this.doamin!.sendEventsToAll(this.doamin!.replaceNests(nNests));
  }

  private generateNests(): Nest[] {
    return [
      {
        id: 1,
        currency: 'Euro',
        country: 'EU',
        units: 'EUR / USD',
        code: 'EUR',
        level: Math.random(),
        total: 0
      },
      {
        id: 2,
        currency: 'Romanian New Leu',
        country: 'RO',
        units: 'RON / USD',
        code: 'RON',
        level: Math.random(),
        total: 0
      },
      {
        id: 3,
        currency: 'Pound Sterling',
        country: 'UK',
        units: 'GBP / USD',
        code: 'GBP',
        level: Math.random(),
        total: 0
      }
    ];
  }
}
