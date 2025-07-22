import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Import the necessary functions for HttpClient and Interceptors
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './services/auth.interceptor';
import { routes } from './app.routes';

// Define the application configuration
export const appConfig: ApplicationConfig = {
  providers: [
    // Standard Angular providers
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    
    // This line registers our AuthInterceptor globally. It is the
    // single source of truth for all HTTP requests in the application.
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};