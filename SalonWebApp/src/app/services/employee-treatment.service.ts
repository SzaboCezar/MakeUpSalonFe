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
      (h) => h.employeeTreatmentsID === id
    ) as EmployeeTreatment;
    this.logService.add(
      `EmployeeTreatmentService | getEmployeeTreatment: fetched employeeTreatment with id=${id}`
    );
    return of(employeeTreatment);
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

    // employeeTreatment.employeeTreatmentsID =
    //   +employeeTreatment.employeeTreatmentsID;

    // if (
    //   this.employeeTreatments.find(
    //     (h) => h.employeeTreatmentsID === employeeTreatment.employeeTreatmentsID
    //   )
    // ) {
    //   this.logService.add(
    //     `EmployeeTreatment | Treatment Add: employeeTreatment with id=${
    //       employeeTreatment.employeeTreatmentsID
    //     } already exists - ${Date.now()}`
    //   );
    //   throw new Error('EmployeeTreatment with this id already exists');
    // }

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
            `EmployeeTreatmentService | Treatment Add: added ${employeeTreatment.employeeTreatmentsID}`
          );
        }),
        catchError((error) => {
          console.error('Error while adding employeeTreatment:', error);
          this.logService.add(
            `EmployeeTreatmentService | EmployeeTreatment Add: error adding ${employeeTreatment.employeeTreatmentsID}`
          );
          throw error;
        })
      );
  }
}
