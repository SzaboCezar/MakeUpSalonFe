// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) }, // Home route
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'enrollment', loadComponent: () => import('./components/enrollment/enrollment.component').then(m => m.EnrollmentComponent)},
  { path: 'password-reset', loadComponent: () => import('./components/password-reset/password-reset.component').then(m => m.PasswordResetComponent)},
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Default route
];
