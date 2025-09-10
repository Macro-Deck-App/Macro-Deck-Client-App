import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideServiceWorker } from '@angular/service-worker';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { addIcons } from 'ionicons';
import { heartOutline, timer, menuOutline, add, ellipsisHorizontal, trash, qrCodeOutline, } from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import {IonicStorageModule} from "@ionic/storage-angular";

addIcons({
  'heart-outline': heartOutline,
  'timer': timer,
  'menu-outline': menuOutline,
  'add': add,
  'ellipsis-horizontal': ellipsisHorizontal,
  'trash': trash,
  'qr-code-outline': qrCodeOutline,
})

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideIonicAngular({ swipeBackEnabled: false }),
    provideHttpClient(withInterceptorsFromDi()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    importProvidersFrom(IonicStorageModule.forRoot()),
  ]
}).catch(err => console.error(err));