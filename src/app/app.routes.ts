import { Routes } from '@angular/router';
import { App } from './app';
import { Login } from './features/auth/pages/login/login';
import { Dashboard } from './features/dashboard/pages/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '',
    component: Dashboard
  },
  {
    path: 'login',
    component: Login
  }
];