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

        if (appointments.length > 0) {
          appointments.forEach((appointment) => {
            console.log('appointment fetched ++++ ', appointment);
            if (appointment.approvalStatus === Status.EXPIRED.toUpperCase()) {
              return;
            }

            if (this.isAppointmentExpired(appointment)) {
              const appointmentData = {
                appointmentId: appointment.appointmentId,
                customerId: appointment.customerId,
                startDateTime: appointment.startDateTime,
                approvalStatus: appointment.approvalStatus,
                employeeId: appointment.employeeId,
                treatmentId: appointment.treatmentId,
                // treatmentName: appointment.treatmentName,
                // treatmentPrice: appointment.treatmentPrice,
                // treatmentDescription: appointment.treatmentDescription,
              };
              console.log(
                'appointment status:++++++++++ ',
                appointment.approvalStatus
              );
              if (
                appointment.approvalStatus ===
                Status.PENDING.valueOf().toUpperCase()
              ) {
                console.log(
                  'ENTERED APOINTMENT DATA MODIFY ?++++++++++++++++++++++++++++++++++++++++++++++++++++++'
                );
                appointmentData.approvalStatus = Status.EXPIRED;
              }

              console.log('Marking appointment as EXPIRED:', appointmentData);
              this.updateAppointment(appointmentData).subscribe(
                () => {
                  console.log('Appointment updated successfully');
                  this.fetchAppointments().subscribe();
                },
                (error) => {
                  console.error('Error updating appointment:', error);
                }
              );
            }
          });
        }
      }),
      catchError((error) => {
        console.error('Error fetching appointments:', error);
        throw error; // throw error further to handle in component
      })
    );
  }

  private isAppointmentExpired(appointment: Appointment): boolean {
    if (appointment.startDateTime) {
      const startDateTime = new Date(appointment.startDateTime);
      return startDateTime < new Date(); // compare with current date/time
    }
    return false; // handle case where startDateTime is not defined
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

  deleteAppointment(id: number): Observable<any> {
    const appointmentIndex = this.appointments.findIndex(
      (t) => t.appointmentId === id
    );
    if (appointmentIndex === -1) {
      this.logService.add(
        `AppointmentService | Appointment Delete: appointment with id=${id} not found`
      );
      throw new Error('Appointment with this id does not exist');
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.appointments.splice(appointmentIndex, 1);
        this.appointmentsChanged.next(this.appointments.slice());
        console.log(
          `AppointmentService | Appointment Delete: deleted appointment with id=${id}`
        );
      }),
      catchError((error) => {
        console.error('Error while deleting appointment:', error);
        this.logService.add(
          `AppointmentService | Appointment Delete: error deleting ${id}`
        );
        throw error;
      })
    );
  }
}
