import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { Appointment } from '../shared/models/Appointment.model';
import { LogsService } from '../logs/logs.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private baseUrl: string = 'http://localhost:8080/api/appointments';

  appointmentsChanged = new Subject<Appointment[]>();

  private appointments: Appointment[] = [];

  constructor(private logService: LogsService, private http: HttpClient) {}

  /*
   * Fetches the appointments from the API and sets the appointments in memory array.
   */
  fetchAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl).pipe(
      tap((appointments) => {
        this.setAppointments(appointments);
        console.log('AppointmentService → fetchAppointments() called');
      })
    );
  }

  setAppointments(appointments: Appointment[]) {
    this.appointments = appointments;
    this.appointmentsChanged.next(this.appointments.slice());
  }

  getAppointments() {
    // const appointments = of(this.appointments.slice());
    // return appointments;
    return this.appointments.slice();
  }

  getAppointment(id: number): Observable<Appointment> {
    const appointment = this.appointments.find(
      (h) => h.appointmentID === id
    ) as Appointment;
    this.logService.add(
      `AppointmentService | getAppointment: fetched appointment with id=${id}`
    );
    return of(appointment);
  }

  addAppointment(appointment: {
    customerId: number;
    startDateTime: string;
    employeeId: number;
    treatmentId: number;
  }): Observable<any> {
    return this.http.post<any>(this.baseUrl, appointment);
  }
}
