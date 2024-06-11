import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { EmployeeTreatment } from '../shared/models/EmployeeTreatment.model';
import { AppointmentService } from './appointment.service';
import { LogsService } from '../logs/logs.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EmployeeTreatmentService {
  private baseUrl: string = 'http://localhost:8080/api/employee-treatments';

  employeeTreatmentsChanged = new Subject<EmployeeTreatment[]>();

  private employeeTreatments: EmployeeTreatment[] = [];

  constructor(private logService: LogsService, private http: HttpClient) {}
  /*
   * Fetches the employeeTreatments from the API and sets the employeeTreatments in memory array.
   */
  fetchEmployeeTreatments(): Observable<EmployeeTreatment[]> {
    return this.http.get<EmployeeTreatment[]>(this.baseUrl).pipe(
      tap((employeeTreatments) => {
        this.setEmployeeTreatments(employeeTreatments);
        console.log(
          'EmployeeTreatmentService → fetchEmployeeTreatments() called'
        );
      })
    );
  }

  setEmployeeTreatments(employeeTreatment: EmployeeTreatment[]) {
    this.employeeTreatments = employeeTreatment;
    this.employeeTreatmentsChanged.next(this.employeeTreatments.slice());
  }

  getEmployeeTreatments() {
    return this.employeeTreatments.slice();
  }

  getEmployeeTreatment(id: number): Observable<EmployeeTreatment> {
    const employeeTreatment = this.employeeTreatments.find(
      (h) => h.employeeTreatmentsId === id
    ) as EmployeeTreatment;
    this.logService.add(
      `EmployeeTreatmentService | getEmployeeTreatment: fetched employeeTreatment with id=${id}`
    );
    return of(employeeTreatment);
  }

  getEmployeeTreatmentById(id: number): Observable<EmployeeTreatment> {
    return this.http.get<EmployeeTreatment>(`${this.baseUrl}/${id}`).pipe(
      tap((employeeTreatment) => {
        this.logService.add(
          `EmployeeTreatmentService | getEmployeeTreatmentById: fetched employeeTreatment with id=${id}`
        );
      }),
      catchError((error) => {
        console.error(
          `Error while fetching employeeTreatment with id=${id}:`,
          error
        );
        this.logService.add(
          `EmployeeTreatmentService | getEmployeeTreatmentById: error fetching employeeTreatment with id=${id}`
        );
        return of({} as EmployeeTreatment);
      })
    );
  }

  addEmployeeTreatment(
    employeeTreatment: EmployeeTreatment
  ): Observable<EmployeeTreatment> {
    if (!employeeTreatment) {
      this.logService.add(
        `EmployeeTreatmentService | EmployeeTreatment Add: employeeTreatment is undefined - ${Date.now()}`
      );
      throw new Error('EmployeeTreatment is undefined');
    }

    return this.http
      .post<EmployeeTreatment>(`${this.baseUrl}`, employeeTreatment)
      .pipe(
        tap((newEmployeeTreatment: EmployeeTreatment) => {
          console.log(
            'EmployeeTreatment Service | Treatment Add | Post new employeeTreatment: ',
            newEmployeeTreatment
          );
          this.employeeTreatments.push(newEmployeeTreatment);
          this.employeeTreatmentsChanged.next(this.employeeTreatments.slice());
          this.logService.add(
            `EmployeeTreatmentService | Treatment Add: added ${employeeTreatment.employeeTreatmentsId}`
          );
        }),
        catchError((error) => {
          console.error('Error while adding employeeTreatment:', error);
          this.logService.add(
            `EmployeeTreatmentService | EmployeeTreatment Add: error adding ${employeeTreatment.employeeTreatmentsId}`
          );
          throw error;
        })
      );
  }

  /*
   * Updates an existing employeeTreatment.
   */
  updateEmployeeTreatment(
    id: number,
    employeeTreatment: EmployeeTreatment
  ): Observable<EmployeeTreatment> {
    if (!employeeTreatment) {
      this.logService.add(
        `EmployeeTreatmentService | EmployeeTreatment Update: employeeTreatment is undefined or missing ID - ${Date.now()}`
      );
      throw new Error('EmployeeTreatment is undefined or missing ID');
    }

    return this.http
      .put<EmployeeTreatment>(`${this.baseUrl}/${id}`, employeeTreatment)
      .pipe(
        tap((updatedEmployeeTreatment: EmployeeTreatment) => {
          console.log(
            'EmployeeTreatment Service | Treatment Update | Put employeeTreatment: ',
            updatedEmployeeTreatment
          );
          const index = this.employeeTreatments.findIndex(
            (et) => et.employeeTreatmentsId === id
          );
          if (index !== -1) {
            this.employeeTreatments[index] = updatedEmployeeTreatment;
            this.employeeTreatmentsChanged.next(
              this.employeeTreatments.slice()
            );
          }
          this.logService.add(
            `EmployeeTreatmentService | Treatment Update: updated ${employeeTreatment.employeeTreatmentsId}`
          );
        }),
        catchError((error) => {
          console.error('Error while updating employeeTreatment:', error);
          this.logService.add(
            `EmployeeTreatmentService | EmployeeTreatment Update: error updating ${employeeTreatment.employeeTreatmentsId}`
          );
          throw error;
        })
      );
  }
}
