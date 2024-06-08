import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { Person } from '../shared/models/Person.model';
import { LogsService } from '../logs/logs.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../shared/models/Appointment.model';
import { IntervalDTO } from '../shared/models/DTO/IntervalDTO.model';
import { EmployeeTreatment } from '../shared/models/EmployeeTreatment.model';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  private baseUrl: string = 'http://localhost:8080/api/persons';

  personsChanged = new Subject<Person[]>();
  unavailableChanged = new Subject<IntervalDTO[]>();
  appointmentChanged = new Subject<Appointment[]>();
  treatmentChanged = new Subject<EmployeeTreatment[]>();

  private persons: Person[] = [];
  private unavailable: IntervalDTO[] = [];
  private appointments: Appointment[] = [];
  private treatments: EmployeeTreatment[] = [];

  constructor(private logService: LogsService, private http: HttpClient) {}

  /*
   * Fetches the persons from the API and sets the persons in memory array.
   */
  fetchPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl).pipe(
      tap((persons) => {
        this.setPersons(persons);
        console.log('PersonService → fetchPersons() called');
      })
    );
  }

  setPersons(persons: Person[]) {
    this.persons = persons;
    this.personsChanged.next(this.persons.slice());
  }

  getPersons() {
    // const persons = of(this.persons.slice());
    // return persons;
    return this.persons.slice();
  }

  getPerson(id: number): Observable<Person> {
    const person = this.persons.find((h) => h.personId === id) as Person;
    this.logService.add(
      `PersonService | getPerson: fetched person with id=${id}`
    );
    return of(person);
  }

  getUnavailableTimes(id: number): Observable<IntervalDTO[]> {
    return this.http
      .get<IntervalDTO[]>(`${this.baseUrl}/id/${id}/unavailable`)
      .pipe(
        tap((intervals) => {
          if (!Array.isArray(intervals)) {
            intervals = [intervals];
          }
          return intervals;
        }),
        tap((intervals) => {
          this.setUnavailable(intervals);
          console.log('PersonService → getUnavailableTimes() called');
        })
      );
  }

  setUnavailable(intervals: IntervalDTO[]) {
    this.unavailable = intervals;
    this.unavailableChanged.next(this.unavailable.slice());
  }

  getAppointmentsByPersonId(id: number): Observable<Appointment[]> {
    return this.http
      .get<Appointment[]>(`${this.baseUrl}/id/${id}/appointments`)
      .pipe(
        tap((appointments) => {
          if (!Array.isArray(appointments)) {
            appointments = [appointments];
          }
          return appointments;
        }),
        tap((appointments) => {
          this.setAppointments(appointments);
          console.log('PersonService → getAppointmentsByPersonId() called');
        })
      );
  }

  setAppointments(appointments: Appointment[]) {
    this.appointments = appointments;
    this.appointmentChanged.next(this.appointments.slice());
  }

  getTreatmentsByPersonId(id: number): Observable<EmployeeTreatment[]> {
    return this.http
      .get<EmployeeTreatment[]>(`${this.baseUrl}/id/${id}/treatments`)
      .pipe(
        tap((treatments) => {
          if (!Array.isArray(treatments)) {
            treatments = [treatments];
          }
          return treatments;
        }),
        tap((treatments) => {
          this.setEmployeeTreatments(treatments);
          console.log('PersonService → getTreatmentsByPersonId() called');
        })
      );
  }

  setEmployeeTreatments(treatments: EmployeeTreatment[]) {
    this.treatments = treatments;
    this.treatmentChanged.next(this.treatments.slice());
  }

  getPersonById(id: number): Observable<Person> {
    const url = `${this.baseUrl}/id/${id}`;
    return this.http.get<Person>(url);
  }
}
