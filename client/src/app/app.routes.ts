//
// [smritii]
//
// Sanjeev Premi <spremi@ymail.com>
//
// BSD-3-Clause License
//

import { Routes } from '@angular/router';
import { AboutComponent } from '@routes/about/about.component';
import { E404Component } from '@routes/e404/e404.component';
import { HomeComponent } from '@routes/home/home.component'
import { ViewComponent } from '@routes/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home'
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'view',
    component: ViewComponent
  },
  {
    path: '**',
    component: E404Component
  },
];
