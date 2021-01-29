// import chai from 'chai';
import { Injector } from 'adr-express-ts';
import chai, { expect } from 'chai';

import { events } from '../init';
import TestApp from '../TestApp';
import app from '../../index';
import { Nest } from '../../@types/SSE';

// eslint-disable-next-line mocha/no-skipped-tests
describe.skip('Check the connection', function () {
  let nests: any[];
  let testApp: TestApp | null;

  before(function (done) {
    testApp = Injector.get<TestApp>('Test.App');

    events!.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (!nests && Array.isArray(parsedData)) {
        nests = parsedData;
        done();
      } else {
        nests = [...nests, parsedData];
      }
    };
  });

  it('Expect to have 3 items by default', async function () {
    expect(nests).to.have.lengthOf(3);
  });

  it('Add a nest and expect to receive it', async function () {
    const nest: Nest = {
      id: 1,
      country: 'string',
      code: 'string',
      currency: 'string',
      level: 1,
      units: 'string',
      total: 1,
      quantity: 1
    };

    const currentLength = nests.length;

    testApp!.createNest(nest);

    do {
      await new Promise((resolve) => setTimeout(resolve));
    } while (nests.length <= currentLength);

    expect(nests[parseInt(currentLength.toString())]).to.be.deep.equal(nest);
  });

  it('Expect to have 1 clinet connected', async function () {
    const res = await chai.request(app).get('/api/v1/sse/status');
    expect(res.body).to.be.deep.equal({
      success: true,
      clients: 1
    });
  });
});
