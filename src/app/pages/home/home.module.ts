import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import {WebHomePageModule} from "../web-home/web-home.module";
import {AddConnectionComponent} from "./modals/add-connection/add-connection.component";
import {ConnectingComponent} from "./modals/connecting/connecting.component";
import {ConnectionFailedComponent} from "./modals/connection-failed/connection-failed.component";
import {ConnectionLostComponent} from "./modals/connection-lost/connection-lost.component";
import {InsecureConnectionComponent} from "./modals/insecure-connection/insecure-connection.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebHomePageModule
  ],
  declarations: [
    HomePage,
    AddConnectionComponent,
    ConnectingComponent,
    ConnectionFailedComponent,
    ConnectionLostComponent,
    InsecureConnectionComponent
  ]
})
export class HomePageModule {}
