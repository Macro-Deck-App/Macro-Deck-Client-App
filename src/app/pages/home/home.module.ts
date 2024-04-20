import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {ConnectionsPageModule} from "./connections/connections.module";
import {WebHomePageModule} from "../web-home/web-home.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ConnectionsPageModule,
    WebHomePageModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
