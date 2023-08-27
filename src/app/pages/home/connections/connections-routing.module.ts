import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConnectionsPage } from './connections.page';

const routes: Routes = [
  {
    path: '',
    component: ConnectionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectionsPageRoutingModule {}
