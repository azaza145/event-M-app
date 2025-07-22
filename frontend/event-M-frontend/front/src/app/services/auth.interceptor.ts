import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

/**
 * --- LAST RESORT DEBUG INTERCEPTOR ---
 * This version will log everything to the console to prove if it is running.
 */
export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Log every single request that passes through the interceptor.
  console.log(
    `%c[AuthInterceptor] RUNNING! Intercepting request to: ${req.url}`,
    'color: #f59e0b; font-weight: bold;'
  );

  const authService = inject(AuthService);
  const authToken = authService.getToken();

  if (authToken) {
    // Log that a token was found and what it is.
    console.log(
      `%c[AuthInterceptor] Token found. Adding header. Token: Bearer ${authToken.substring(0, 20)}...`,
      'color: green;'
    );
    
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  } else {
    // Log that no token was found.
    console.warn('%c[AuthInterceptor] No token found. Sending request without auth header.', 'color: red;');
    return next(req);
  }
};