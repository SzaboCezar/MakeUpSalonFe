import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { Appointment } from '../shared/models/Appointment.model';
import { LogsService } from '../logs/logs.service';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Status } from '../shared/models/Enum/Status.enum';

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
      (h) => h.appointmentId === id
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

  updateAppointment(
    appointmentToBeUpdated: Appointment
  ): Observable<Appointment> {
    if (!appointmentToBeUpdated) {
      this.logService.add(
        `AppointmentService | Appointment Update: appointment is undefined - ${Date.now()}`
      );
      throw new Error('Appointment is undefined');
    }

    appointmentToBeUpdated.appointmentId =
      +appointmentToBeUpdated.appointmentId;

    const appointmentIndex = this.appointments.findIndex(
      (foundAppointment) =>
        foundAppointment.appointmentId === appointmentToBeUpdated.appointmentId
    );
    console.log(
      'AppointmentService | Appointment Update: appointmentIndex: ',
      appointmentIndex
    );

    //Check if the treatment exists in the array
    if (appointmentIndex === -1) {
      this.logService.add(
        `AppointmentService | Appointment Update: appoint with id=${appointmentToBeUpdated.appointmentId} not found`
      );
      throw new Error('Appointment with this id does not exist');
    }

    return this.http
      .put<Appointment>(
        `${this.baseUrl}/${appointmentToBeUpdated.appointmentId}`,
        appointmentToBeUpdated
      )
      .pipe(
        tap((updatedAppointment: Appointment) => {
          console.log(
            'AppointmentService | Appointment Update: updated appointment: ',
            updatedAppointment
          );
          this.appointments[appointmentIndex] = appointmentToBeUpdated;
          this.appointmentsChanged.next(this.appointments.slice());
          this.logService.add(
            `AppointmentService | Appointment Update: updated ${appointmentToBeUpdated.appointmentId}`
          );
        }),
        catchError((error) => {
          console.error('Error while updating appointment:', error);
          this.logService.add(
            `AppointmentService | Appointment Update: error updating ${appointmentToBeUpdated.appointmentId}`
          );
          throw error;
        })
      );
  }
  // updateAppointment(
  //   appointmentToBeUpdated: Appointment
  // ): Observable<Appointment> {
  //   if (!appointmentToBeUpdated) {
  //     this.logService.add(
  //       `AppointmentService | Appointment Update: appointment is undefined - ${Date.now()}`
  //     );
  //     throw new Error('Appointment is undefined');
  //   }

  //   const id = appointmentToBeUpdated.appointmentId;
  //   console.log('+++++++++++++++++++++++', id);
  //   console.log('+++++++++++++++++++++++++++', appointmentToBeUpdated);

  //   return this.http
  //     .put<Appointment>(`${this.baseUrl}/${id}`, appointmentToBeUpdated)
  //     .pipe(
  //       tap((updatedAppointment: Appointment) => {
  //         console.log(
  //           'Inside tap operator - updated appointment:',
  //           updatedAppointment
  //         );

  //         const index = this.appointments.findIndex(
  //           (a) => a.appointmentId === id
  //         );
  //         if (index !== -1) {
  //           this.appointments[index] = updatedAppointment;
  //           this.appointmentsChanged.next(this.appointments.slice());
  //         }

  //         this.logService.add(
  //           `AppointmentService | Appointment Update: updated appointment with id=${id}`
  //         );
  //       }),
  //       catchError((error) => {
  //         console.error('Error while updating appointment:', error);

  //         this.logService.add(
  //           `AppointmentService | Appointment Update: error updating appointment with id=${id}`
  //         );

  //         throw error; // Rethrow the error to propagate it to the subscriber
  //       })
  //     );
  // }

  // updateAppointmentStatus(id: number, status: Status): Observable<Appointment> {
  //   return this.getAppointment(id).pipe(
  //     switchMap((appointment) => {
  //       if (!appointment) {
  //         console.error(
  //           `Appointment with id=${id} not found for status update.`
  //         );
  //         throw new Error(
  //           `Appointment with id=${id} not found for status update.`
  //         );
  //       }

  //       const updatedAppointment = { ...appointment, approvalStatus: status };
  //       console.log('Updating appointment status:', updatedAppointment);
  //       return this.updateAppointment(updatedAppointment);
  //     }),
  //     catchError((error) => {
  //       console.error(
  //         `Error fetching appointment with id=${id} for status update:`,
  //         error
  //       );
  //       return of({} as Appointment); // Return empty appointment on error
  //     })
  //   );
  // }
}
