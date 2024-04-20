import { WebPlugin } from '@capacitor/core';

import type { SslHandlerPlugin } from './definitions';

export class SslHandlerWeb extends WebPlugin implements SslHandlerPlugin {
  skipValidation(_: { value: boolean }): void {
  }
}
