import { Routes } from '@angular/router';

import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

import { authGuard } from './core/guards/auth-guard';
import { AdminLayout } from './layout/admin-layout/admin-layout.component';
import { EngineerLayout } from './layout/engineer-layout/engineer-layout.component';
import { redirectIfAuthGuard } from './core/guards/redirect-if-auth-guard';

export const routes: Routes = [
  // Page par défaut
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  // Connexion
  {
  path: 'login',
  component: Login,
  canActivate: [redirectIfAuthGuard],
  },

  // Espace administrateur
  {
    path: 'admin',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },

  // Espace ingénieur
  {
    path: 'engineer',
    component: EngineerLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        component: Dashboard,
      },
    ],
  },

  // Toute URL inconnue → login
  {
    path: '**',
    redirectTo: 'login',
  },
];
