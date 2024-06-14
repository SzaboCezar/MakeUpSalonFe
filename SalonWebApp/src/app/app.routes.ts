// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EnrollmentComponent } from './components/enrollment/enrollment.component';
import { TreatmentsResolverService } from './resolvers/treatments-resolver.service';
import { TreatmentListComponent } from './components/treatment/treatment-list/treatment-list.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { TreatmentAddComponent } from './components/treatment/treatment-add/treatment-add.component';
import { TreatmentDeleteComponent } from './components/treatment/treatment-delete/treatment-delete.component';
import { TreatmentDetailUpdateComponent } from './components/treatment/treatment-detail/treatment-detail-update/treatment-detail-update.component';
import { AppointmentAddComponent } from './components/appointment/appointment-add/appointment-add.component';
import { AppointmentListComponent } from './components/appointment/appointment-list/appointment-list.component';
import { AppointmentsResolverService } from './resolvers/appointments-resolver.service';
import { ChangePasswordComponent } from './auth/password/change-password/change-password.component';
import { ResetPasswordEmailComponent } from './auth/password/reset-password/reset-password-email/reset-password-email.component';
import { ResetPasswordComponent } from './auth/password/reset-password/reset-password.component';
import { RoleGuard } from './auth/role.guard';
import { PersonsResolverService } from './resolvers/persons-resolver.service';
import { AppointmentDetailUpdateComponent } from './components/appointment/appointment-detail/appointment-detail-update/appointment-detail-update.component';

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
    resolve: { treatments: TreatmentsResolverService },
  },
  {
    path: 'treatment/add',
    canActivate: [AuthGuard, RoleGuard], // Guardul care protejează ruta
    data: { roles: ['ADMIN', 'EMPLOYEE'] }, // Datele necesare pentru guard
    component: TreatmentAddComponent,
  },
  {
    path: 'treatment/detail/update/:id',
    canActivate: [AuthGuard, RoleGuard], // Guardul care protejează ruta
    component: TreatmentDetailUpdateComponent,
    data: { roles: ['ADMIN', 'EMPLOYEE'] }, // Datele necesare pentru guard
    resolve: { treatments: TreatmentsResolverService },
  },
  {
    path: 'treatment/delete/:id',
    canActivate: [AuthGuard, RoleGuard], // Guardul care protejează ruta
    component: TreatmentDeleteComponent,
    data: { roles: ['ADMIN', 'EMPLOYEE'] }, // Datele necesare pentru guard
    resolve: { treatments: TreatmentsResolverService },
  },

  //Book
  {
    path: 'book',
    canActivate: [AuthGuard],
    component: AppointmentAddComponent,
    resolve: {
      treatments: TreatmentsResolverService,
      // appointments: AppointmentsResolverService,
      // persons:  PersonsResolverService
    },
  },

  //Appointment
  {
    path: 'my-appointments',
    canActivate: [AuthGuard],
    component: AppointmentListComponent,
    resolve: {
      treatments: TreatmentsResolverService,
      appointments: AppointmentsResolverService,
    },
  },
  {
    path: 'appointment/detail/update/:id',
    canActivate: [AuthGuard, RoleGuard], // Guardul care protejează ruta
    component: AppointmentDetailUpdateComponent,
    data: { roles: ['CUSTOMER'] }, // Datele necesare pentru guard
    resolve: { appointments: AppointmentsResolverService },
  },

  //General routes
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard], // Guardul care protejează ruta
  },
  { path: 'reset-password', component: ResetPasswordEmailComponent },
  { path: 'reset-password/:emailAndToken', component: ResetPasswordComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Default route
];
