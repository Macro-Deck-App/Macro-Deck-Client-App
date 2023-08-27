import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ConnectionsPageRoutingModule} from './connections-routing.module';

import {ConnectionsPage} from './connections.page';
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {ConnectionFailedComponent} from "./modals/connection-failed/connection-failed.component";
import {InsecureConnectionComponent} from "./modals/insecure-connection/insecure-connection.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ConnectionsPageRoutingModule
    ],
    exports: [
        ConnectionsPage
    ],
    declarations: [
        ConnectionsPage,
        AddConnectionComponent,
        ConnectionFailedComponent,
        InsecureConnectionComponent
    ]
})
export class ConnectionsPageModule {
}
