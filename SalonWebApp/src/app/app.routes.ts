// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { TreatmentsResolverService } from './resolvers/treatments-resolver.service';
import {TreatmentListComponent} from "./components/treatment/treatment-list/treatment-list.component";
import {AuthComponent} from "./auth/auth.component";
import {AuthGuard} from "./auth/auth.guard";
import {TreatmentAddComponent} from "./components/treatment/treatment-add/treatment-add.component";
import {TreatmentDeleteComponent} from "./components/treatment/treatment-delete/treatment-delete.component";
import {
  TreatmentDetailUpdateComponent
} from "./components/treatment/treatment-detail/treatment-detail-update/treatment-detail-update.component";
import {ResetPasswordEmailComponent} from "./auth/reset-password/reset-password-email/reset-password-email.component";

export const routes: Routes = [
  //General routes
  { path: '', component: HomeComponent }, // Home route
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
    path: 'treatment/add',
    canActivate: [AuthGuard], // Guardul care protejează ruta
    component: TreatmentAddComponent,
  },
  {
    path: 'treatment/detail/update/:id',
    canActivate: [AuthGuard], // Guardul care protejează ruta
    component: TreatmentDetailUpdateComponent,
    resolve: { treatments: TreatmentsResolverService }
  },
  {
    path: 'treatment/delete/:id',
    canActivate: [AuthGuard], // Guardul care protejează ruta
    component: TreatmentDeleteComponent,
    resolve: { treatments: TreatmentsResolverService }
  },




  //General routes
  { path: 'reset-password', component: ResetPasswordEmailComponent },
  { path: 'reset-password/:emailAndToken', component: ResetPasswordComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Default route
];
