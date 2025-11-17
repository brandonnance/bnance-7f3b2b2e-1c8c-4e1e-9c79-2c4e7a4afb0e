import { ApplicationConfig } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { JwtInterceptor } from './auth/jwt-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // HttpClient for the whole app, using interceptors from DI
    provideHttpClient(withInterceptorsFromDi()),
    // Register our JWT interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
  ],
};
