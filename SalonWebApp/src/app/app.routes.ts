// src/app/app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent) }, // Home route
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) },
  { path: 'enrollment', loadComponent: () => import('./components/enrollment/enrollment.component').then(m => m.EnrollmentComponent) },
  { path: 'reset-password', loadComponent: () => import('./components/reset-password/reset-password.component').then(m => m.ResetPasswordComponent) },
  { path: 'user-details', loadComponent: () => import('./components/users/users-detail/users-detail.component').then(m => m.UsersDetailComponent) },

  { path: '**', redirectTo: '', pathMatch: 'full' }, // Default route
];
