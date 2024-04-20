import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {IonicModule} from '@ionic/angular';

import {ConnectionsPage} from './connections.page';
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {ConnectionFailedComponent} from "./modals/connection-failed/connection-failed.component";
import {InsecureConnectionComponent} from "./modals/insecure-connection/insecure-connection.component";
import {ConnectionLostComponent} from "./modals/connection-lost/connection-lost.component";
import {ConnectingComponent} from "./modals/connecting/connecting.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ],
  exports: [
    ConnectionsPage
  ],
  declarations: [
    ConnectionsPage,
    AddConnectionComponent,
    ConnectionFailedComponent,
    InsecureConnectionComponent,
    ConnectionLostComponent,
    ConnectingComponent
  ]
})
export class ConnectionsPageModule {
}
