import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';
import { TypeRole } from '../../features/auth/models/auth.model';

export const redirectIfAuthGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const auth = inject(Auth);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    return true;
  }

  const role = auth.getRole();

  if (role === TypeRole.ADMINISTRATEUR || role === TypeRole.CHEF_DE_DEPARTEMENT) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  if (role === TypeRole.INGENIEUR || role === TypeRole.OPERATEUR) {
    return router.createUrlTree(['/engineer/dashboard']);
  }

  return true;
};