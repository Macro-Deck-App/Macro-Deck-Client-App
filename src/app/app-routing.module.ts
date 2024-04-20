import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {environment} from "../environments/environment";

const routes: Routes = [
  {
    path: '',
    loadChildren: async () => {
      if (!environment.webVersion) {
        let homeModule = await import('./pages/home/home.module');
        return homeModule.HomePageModule;
      }
      let webHomeModule = await import('./pages/web-home/web-home.module');
      return webHomeModule.WebHomePageModule;
    }
  },
  {
    path: 'deck',
    loadChildren: () => import('./pages/deck/deck.module').then( m => m.DeckPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
