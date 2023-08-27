import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeckPage } from './deck.page';

const routes: Routes = [
  {
    path: '',
    component: DeckPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeckPageRoutingModule {}
