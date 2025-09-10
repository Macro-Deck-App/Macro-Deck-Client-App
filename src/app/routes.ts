import { Routes } from '@angular/router';
import { environment } from '../environments/environment';

export const routes: Routes = [
  {
    path: '',
    redirectTo: environment.webVersion ? 'web-home' : 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'web-home',
    loadComponent: () =>
      import('./pages/web-home/web-home.page').then(m => m.WebHomePage)
  },
  {
    path: 'deck',
    loadComponent: () =>
      import('./pages/deck/deck.page').then(m => m.DeckPage)
  },
  {
    path: 'connection-lost',
    loadComponent: () =>
      import('./pages/connection-lost/connection-lost.page').then(m => m.ConnectionLostPage)
  }
];