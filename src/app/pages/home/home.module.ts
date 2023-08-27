import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import {ConnectionsPageModule} from "./connections/connections.module";
import {SplashscreenComponent} from "./splashscreen/splashscreen.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ConnectionsPageModule
  ],
  declarations: [HomePage, SplashscreenComponent]
})
export class HomePageModule {}
