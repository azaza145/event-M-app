// src/app/services/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Protects routes that require a user to be logged in.
 * If the user is not authenticated, it blocks navigation
 * and redirects them to the login page.
 */
export const authGuard: CanActivateFn = (route, state) => {
  // Use dependency injection to get instances of the service and router
  const authService = inject(AuthService);
  const router = inject(Router);

  // --- THE FIX ---
  // Call the 'isAuthenticated()' method, which correctly returns a boolean (true/false).
  // This replaces the broken 'isLoggedIn()' call.
  if (authService.isAuthenticated()) {
    // If the user is authenticated, the guard allows access to the requested route.
    return true;
  } else {
    // If the user is not authenticated, the guard blocks access.
    console.log('AuthGuard: User not authenticated, redirecting to /login');

    // Redirect the user to the login page so they can sign in.
    router.navigate(['/login']);

    // Return false to cancel the original navigation attempt.
    return false;
  }
};