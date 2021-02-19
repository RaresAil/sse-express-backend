import createDebuger from 'debug';

createDebuger.enable('server:*');

export const log: any = createDebuger('server:sse');
export const routeLog: any = createDebuger('server:sse:router');
export const error: any = createDebuger('server:sse:error');
