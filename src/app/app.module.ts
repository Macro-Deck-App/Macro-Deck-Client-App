import {NgModule, isDevMode} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {IonicModule} from '@ionic/angular';

import {AppComponent} from './app.component';
import {FormsModule} from "@angular/forms";
import {IonicStorageModule} from "@ionic/storage-angular";
import {WidgetContentComponentsModule} from "./widget-content-components/widget-content-components.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {SettingsModalComponent} from "./pages/shared/modals/settings-modal/settings-modal.component";
import {HttpClientModule} from "@angular/common/http";
import {WebHomePageModule} from "./pages/web-home/web-home.module";
import {HomePageModule} from "./pages/home/home.module";
import {DeckPageModule} from "./pages/deck/deck.module";
import {ConnectionLostPageModule} from "./pages/connection-lost/connection-lost.module";

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot({ swipeBackEnabled: false }),
        IonicStorageModule.forRoot(),
        FormsModule,
        WidgetContentComponentsModule,
        WebHomePageModule,
        HomePageModule,
        DeckPageModule,
        ConnectionLostPageModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            enabled: !isDevMode(),
            // Register the ServiceWorker as soon as the application is stable
            // or after 30 seconds (whichever comes first).
            registrationStrategy: 'registerWhenStable:30000'
        }),
        AppComponent,
        SettingsModalComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}
