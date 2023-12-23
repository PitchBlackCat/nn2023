import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'ecosystem',
    loadComponent: () => import('./pages/ecosystem-page/ecosystem-page.component').then(m => m.EcosystemPageComponent)
  },
  {
    path: 'idioten',
    loadComponent: () => import('./pages/idioten-page/idioten-page.component').then(m => m.IdiotenPageComponent)
  },
  {
    path: 'idioten-train-brain-1',
    loadComponent: () => import('./pages/idioten-train-brain-1-page/idioten-train-brain-1-page.component').then(m => m.IdiotenTrainBrain1PageComponent)
  },
];
