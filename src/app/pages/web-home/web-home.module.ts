import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebHomePageRoutingModule } from './web-home-routing.module';

import { WebHomePage } from './web-home.page';
import {ConnectionsPageModule} from "../home/connections/connections.module";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        WebHomePageRoutingModule,
        ConnectionsPageModule
    ],
    exports: [
        WebHomePage
    ],
    declarations: [WebHomePage]
})
export class WebHomePageModule {}
