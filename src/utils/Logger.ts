import createDebuger from 'debug';

const TEST_MODE = process.env.TEST_MODE === 'true';

if (!TEST_MODE) {
  createDebuger.enable('server:*');
} else {
  createDebuger.enable('server:tests*');
}

export const log: any = createDebuger('server:sse');
export const routeLog: any = createDebuger('server:sse:router');
export const error: any = createDebuger('server:sse:error');
