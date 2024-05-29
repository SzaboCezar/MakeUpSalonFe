// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import {TreatmentsResolverService} from "./resolvers/treatments-resolver.service";

export const appConfig: ApplicationConfig = {
  providers: [
    // Plasează resolver-ul înaintea interceptorului în lista de furnizori
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
};
