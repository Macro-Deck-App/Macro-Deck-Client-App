import { registerPlugin } from '@capacitor/core';

import type { SslHandlerPlugin } from './definitions';

const SslHandler = registerPlugin<SslHandlerPlugin>('SslHandler', {
  web: () => import('./web').then(m => new m.SslHandlerWeb()),
});

export * from './definitions';
export { SslHandler };
