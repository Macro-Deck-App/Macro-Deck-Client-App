import {NgModule, isDevMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";
import {WidgetContentComponentsModule} from "./widget-content-components/widget-content-components.module";
import { ServiceWorkerModule } from '@angular/service-worker';
import {SettingsModalComponent} from "./pages/shared/modals/settings-modal/settings-modal.component";
import {HttpClientModule} from "@angular/common/http";

@NgModule({
    declarations: [
        AppComponent,
        SettingsModalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot({swipeBackEnabled: false}),
        IonicStorageModule.forRoot(),
        AppRoutingModule,
        FormsModule,
        WidgetContentComponentsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
}
