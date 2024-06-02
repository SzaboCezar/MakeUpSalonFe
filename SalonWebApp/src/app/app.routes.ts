// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { TreatmentsResolverService } from './resolvers/treatments-resolver.service';
import {TreatmentListComponent} from "./components/treatment/treatment-list/treatment-list.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";
import {TreatmentAddComponent} from "./components/treatment/treatment-add/treatment-add.component";

export const routes: Routes = [
  //General routes
  { path: '', component: HomeComponent }, // Home route
  { path: 'login', component: LoginComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'enrollment', component: EnrollmentComponent },

  //Treatments
  {
    path: 'treatments',
    canActivate: [AuthGuard], // Guardul care protejează ruta
    component: TreatmentListComponent, // Componenta care necesită datele de la resolver
    resolve: { treatments: TreatmentsResolverService }
  },
  {
    path: 'add-treatment',
    //TODO: uncomment the guard
    // canActivate: [AuthGuard], // Guardul care protejează ruta
    component: TreatmentAddComponent,
    resolve: { treatments: TreatmentsResolverService }
  },



  //General routes
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Default route
];
