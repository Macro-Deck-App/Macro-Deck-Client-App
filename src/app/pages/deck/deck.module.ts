import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeckPageRoutingModule } from './deck-routing.module';

import { DeckPage } from './deck.page';
import {WidgetGridComponent} from "./widget-grid/widget-grid.component";
import {WidgetContentComponent} from "./widget-grid/widget-content/widget-content.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeckPageRoutingModule
  ],
    declarations: [
        DeckPage,
        WidgetGridComponent,
        WidgetContentComponent
    ]
})
export class DeckPageModule {}
