import { Routes } from '@angular/router';
import { AppComponent } from './app.component';

export const routes: Routes = [
  {
    path: 'overview',
    title: 'State Overview',
    loadComponent: () => import('./state-overview/state-overview.component').then(m => m.StateOverviewComponent),
  },
  {
    path: 'entity/:type/:id',
    title: 'View Entity',
    loadComponent: () => import('./entity-details/entity-details.component').then(m => m.EntityDetailsComponent),
  },
  {
    path: 'load-json',
    title: 'Load JSON',
    loadComponent: () => import('./load-json/load-json.component').then(m => m.LoadJsonComponent),
  },
  {
    path: '**',
    pathMatch: 'full',
    title: AppComponent.title,
    redirectTo: 'overview',
  },
];
