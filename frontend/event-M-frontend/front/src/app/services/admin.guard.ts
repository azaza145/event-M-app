// src/app/services/admin.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * A route guard that checks if the currently logged-in user has the 'ADMIN' role.
 * If not, it redirects them to their main dashboard and blocks access.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // --- THE FIX ---
  // Replace the broken 'isLoggedIn()' with the correct 'isAuthenticated()'.
  // The logic is now clear: "Is the user authenticated AND are they an admin?"
  if (authService.isAuthenticated() && authService.isAdmin()) {
    // If both conditions are true, allow access to the admin route.
    return true;
  } else {
    // If either condition is false, block access.
    // Provide feedback and redirect to a safe page (the user's own dashboard is a good choice).
    alert('Access Denied: This area is for administrators only.');
    router.navigate(['/dashboard']);
    return false;
  }
};