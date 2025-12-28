import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated() && auth.hasRole('ROLE_ADMIN')) {
    return true;
  }
  router.navigate(['/login'], { queryParams: { redirect: '/admin' } });
  return false;
};
