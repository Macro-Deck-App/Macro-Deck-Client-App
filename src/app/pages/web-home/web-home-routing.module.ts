import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebHomePage } from './web-home.page';

const routes: Routes = [
  {
    path: '',
    component: WebHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebHomePageRoutingModule {}
