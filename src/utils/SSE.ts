import { Nest } from '../@types/SSE';

export const nestToData = (nest: Nest | Nest[]) =>
  `data: ${JSON.stringify(nest)}\n\n`;
