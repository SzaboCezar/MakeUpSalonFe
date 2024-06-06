import { Injectable } from '@angular/core';
import { AppointmentService } from '../services/appointment.service';
import { Appointment } from '../shared/models/Appointment.model';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { LoadingService } from '../services/loading.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppointmentsResolverService implements Resolve<Appointment[]> {
  constructor(
    private appointmentService: AppointmentService,
    private loadingService: LoadingService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const appointments = this.appointmentService.getAppointments();
    if (appointments.length === 0) {
      this.loadingService.setLoading(true);
      console.log('Resolver fetchAppointments() called');
      return this.appointmentService.fetchAppointments().pipe(
        tap((appointments) => {
          this.loadingService.setLoading(false);
        })
      );
    } else {
      return appointments;
    }
  }
}
