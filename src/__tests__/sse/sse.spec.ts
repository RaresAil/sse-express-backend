// import chai from 'chai';
import { Injector } from 'adr-express-ts';
import chai, { expect } from 'chai';

import { events } from '../init';
import TestApp from '../TestApp';
import app from '../../index';

describe('Check the connection', function () {
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
    const nest = {
      currency: 'string',
      country: 'string',
      units: 'string',
      code: 'string',
      level: 0
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
