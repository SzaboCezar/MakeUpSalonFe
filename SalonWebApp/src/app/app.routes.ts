// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TreatmentsResolverService } from './resolvers/treatments-resolver.service';
import {TreatmentListComponent} from "./components/treatment/treatment-list/treatment-list.component";

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent },
  { path: 'enrollment', component: EnrollmentComponent },
  {
    path: 'treatments',
    component: TreatmentListComponent, // Componenta care necesită datele de la resolver
    resolve: { treatments: TreatmentsResolverService }
  },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Default route
];
