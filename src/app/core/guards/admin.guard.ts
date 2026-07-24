import { CanActivateFn, Router } from '@angular/router';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const platformId = inject(PLATFORM_ID);

  // If rendering on the server, we bypass the guard to let the client make the auth decision
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const authService = inject(AuthService);
  const router = inject(Router);

  await authService.waitForInit();

  // user no authenticated
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  // user is not admin
  if (!(await authService.isAdmin())) {
    return router.createUrlTree(['/']);
  }

  return true;
};
