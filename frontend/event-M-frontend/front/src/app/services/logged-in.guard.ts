import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const loggedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) { // If user is logged in...
    // ...redirect them to their dashboard instead of showing the login/register/forgot page.
    router.navigate(['/dashboard']); 
    return false; // Block access to the requested route
  }
  
  // If user is not logged in, allow them to see the page.
  return true;
};