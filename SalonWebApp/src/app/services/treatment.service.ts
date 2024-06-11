import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { Treatment } from '../shared/models/Treatment.model';
import { AppointmentService } from './appointment.service';
import { LogsService } from '../logs/logs.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TreatmentService {
  private baseUrl: string = 'http://localhost:8080/api/treatments';
  private baseUrlUpdate: string =
    'http://localhost:8080/api/treatment/detail/update';

  treatmentsChanged = new Subject<Treatment[]>();

  private treatments: Treatment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private logService: LogsService,
    private http: HttpClient
  ) {}

  /*
   * Fetches the treatments from the API and sets the treatments in memory array.
   */
  fetchTreatments(): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.baseUrl).pipe(
      tap((treatments) => {
        this.setTreatments(treatments);
        console.log('TreatmentService → fetchTreatments() called');
      })
    );
  }

  setTreatments(treatments: Treatment[]) {
    this.treatments = treatments;
    this.treatmentsChanged.next(this.treatments.slice());
  }

  getTreatments() {
    // const treatments = of(this.treatments.slice());
    // return treatments;
    return this.treatments.slice();
  }

  getTreatment(id: number): Observable<Treatment> {
    const treatment = this.treatments.find(
      (h) => h.treatmentID === id
    ) as Treatment;
    this.logService.add(
      `TreatmentService | getTreatment: fetched treatment with id=${id}`
    );
    return of(treatment);
  }

  // addTreatmentsToAppointment(treatments: Treatment[]) {
  //   this.appointmentService.addTreatments(treatments);
  // }

  addTreatment(treatment: Treatment): Observable<Treatment> {
    if (!treatment) {
      this.logService.add(
        `TreatmentService | Treatment Add: treatment is undefined - ${Date.now()}`
      );
      throw new Error('Treatment is undefined');
    }

    treatment.treatmentID = +treatment.treatmentID;

    if (this.treatments.find((h) => h.treatmentID === treatment.treatmentID)) {
      this.logService.add(
        `TreatmentService | Treatment Add: treatment with id=${
          treatment.treatmentID
        } already exists - ${Date.now()}`
      );
      throw new Error('Treatment with this id already exists');
    }

    return this.http.post<Treatment>(`${this.baseUrl}`, treatment).pipe(
      tap((newTreatment: Treatment) => {
        console.log(
          'Treatment Service | Treatment Add | Post new treatment: ',
          newTreatment
        );
        this.treatments.push(newTreatment);
        this.treatmentsChanged.next(this.treatments.slice());
        this.logService.add(
          `TreatmentService | Treatment Add: added ${treatment.treatmentID}`
        );
      }),
      catchError((error) => {
        console.error('Error while adding treatment:', error);
        this.logService.add(
          `TreatmentService | Treatment Add: error adding ${treatment.treatmentID}`
        );
        throw error;
      })
    );
  }

  updateTreatment(treatmentToBeUpdated: Treatment): Observable<Treatment> {
    if (!treatmentToBeUpdated) {
      this.logService.add(
        `TreatmentService | Treatment Update: treatment is undefined - ${Date.now()}`
      );
      throw new Error('Treatment is undefined');
    }

    treatmentToBeUpdated.treatmentID = +treatmentToBeUpdated.treatmentID;

    const treatmentIndex = this.treatments.findIndex(
      (foundedTreatment) =>
        foundedTreatment.treatmentID === treatmentToBeUpdated.treatmentID
    );
    console.log(
      'TreatmentService | Treatment Update: treatmentIndex: ',
      treatmentIndex
    );

    //Check if the treatment exists in the array
    if (treatmentIndex === -1) {
      this.logService.add(
        `TreatmentService | Treatment Update: treatment with id=${treatmentToBeUpdated.treatmentID} not found`
      );
      throw new Error('Treatment with this id does not exist');
    }

    return this.http
      .put<Treatment>(
        `${this.baseUrl}/${treatmentToBeUpdated.treatmentID}`,
        treatmentToBeUpdated
      )
      .pipe(
        tap((updatedTreatment: Treatment) => {
          console.log(
            'TreatmentService | Treatment Update: updated treatment: ',
            updatedTreatment
          );
          this.treatments[treatmentIndex] = treatmentToBeUpdated;
          this.treatmentsChanged.next(this.treatments.slice());
          this.logService.add(
            `TreatmentService | Treatment Update: updated ${treatmentToBeUpdated.treatmentID}`
          );
        }),
        catchError((error) => {
          console.error('Error while updating treatment:', error);
          this.logService.add(
            `TreatmentService | Treatment Update: error updating ${treatmentToBeUpdated.treatmentID}`
          );
          throw error;
        })
      );
  }

  deleteTreatment(id: number): Observable<any> {
    const treatmentIndex = this.treatments.findIndex(
      (t) => t.treatmentID === id
    );
    if (treatmentIndex === -1) {
      this.logService.add(
        `TreatmentService | Treatment Delete: treatment with id=${id} not found`
      );
      throw new Error('Treatment with this id does not exist');
    }

    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        this.treatments.splice(treatmentIndex, 1);
        this.treatmentsChanged.next(this.treatments.slice());
        console.log(
          `TreatmentService | Treatment Delete: deleted treatment with id=${id}`
        );
      }),
      catchError((error) => {
        console.error('Error while deleting treatment:', error);
        this.logService.add(
          `TreatmentService | Treatment Delete: error deleting ${id}`
        );
        throw error;
      })
    );
  }
}
