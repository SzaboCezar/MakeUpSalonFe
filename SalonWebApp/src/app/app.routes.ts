// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TreatmentsResolverService } from './resolvers/treatments-resolver.service';
import { TreatmentListComponent } from "./components/treatment/treatment-list/treatment-list.component";
import { AuthComponent } from "./auth/auth.component";
import { UserListComponent } from './components/user/user-list/user-list.component';
import { UsersResolverService } from './resolvers/users-resolver.service';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'enrollment', component: EnrollmentComponent },
  {
    path: 'treatments',
    component: TreatmentListComponent, // Componenta care necesită datele de la resolver
    resolve: { treatments: TreatmentsResolverService }
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  {
    path: 'users',
    component: UserListComponent, // Componenta care necesită datele de la resolver
    resolve: { users: UsersResolverService }
  },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Default route
];
