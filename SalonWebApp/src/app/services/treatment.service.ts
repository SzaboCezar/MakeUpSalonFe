import { Injectable } from '@angular/core';
import {catchError, Observable, of, Subject} from 'rxjs';
import { Treatment } from '../shared/models/Treatment.model';
import { AppointmentService } from './appointment.service';
import {LogsService} from "../logs/logs.service";
import {tap} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private baseUrl: string = 'http://localhost:8080/api/treatments';

  treatmentsChanged = new Subject<Treatment[]>();

  private treatments: Treatment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private logService: LogsService,
    private http: HttpClient

  ) {
  }


  /*
  * Fetches the treatments from the API and sets the treatments in memory array.
   */
   fetchTreatments(): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(this.baseUrl).pipe(
      tap(treatments => {
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

  getTreatment(index: number) {
    return this.treatments[index];
  }

  addTreatmentsToAppointment(treatments: Treatment[]) {
    this.appointmentService.addTreatments(treatments);
  }

  addTreatment(treatment: Treatment): Observable<Treatment> {
    if (!treatment || !treatment.treatmentID || treatment.treatmentID <= 0) {
      this.logService.add(
        `TreatmentService | Treatment Add: treatment is undefined - ${Date.now()}`
      );
      throw new Error('Treatment is undefined');
    }

    treatment.treatmentID = +treatment.treatmentID;

    if (this.treatments.find((h) => h.treatmentID === treatment.treatmentID)) {
      this.logService.add(
        `TreatmentService | Treatment Add: treatment with id=${treatment.treatmentID} already exists - ${Date.now()}`
      );
      throw new Error('Treatment with this id already exists');
    }

    return this.http.post<Treatment>(`${this.baseUrl}`, treatment).pipe(
      tap((newTreatment: Treatment) => {
        console.log("Treatment Service | Treatment Add | Post new treatment: ", newTreatment);
        this.treatments.push(newTreatment);
        this.treatmentsChanged.next(this.treatments.slice());
        this.logService.add(
          `TreatmentService | Treatment Add: added ${treatment.treatmentID}`
        );
      }),
      catchError(error => {
        console.error("Error while adding treatment:", error);
        this.logService.add(
          `TreatmentService | Treatment Add: error adding ${treatment.treatmentID}`
        );
        throw error;
      })
    );
  }


  updateTreatment(index: number, newTreatment: Treatment) {
    this.treatments[index] = newTreatment;
    this.treatmentsChanged.next(this.treatments.slice());
  }

  deleteTreatment(index: number) {
    this.treatments.splice(index, 1);
    this.treatmentsChanged.next(this.treatments.slice());
  }





  //Old methods that I might use later
  // fetchTreatments() {
  //   this.treatmentDataStorageService.fetchTreatments().subscribe((treatments: Treatment[]) => {
  //     this.setTreatments(treatments);
  //   });
  // }

  // addTreatment(treatment: Treatment) {
  //   this.treatmentDataStorageService.addTreatment(treatment).subscribe((newTreatment: Treatment) => {
  //     this.treatments.push(newTreatment);
  //     this.treatmentsChanged.next(this.treatments.slice());
  //   });
  // }
  //
  // updateTreatment(id: number, newTreatment: Treatment) {
  //   this.treatmentDataStorageService.updateTreatment(id, newTreatment).subscribe((updatedTreatment: Treatment) => {
  //     const index = this.treatments.findIndex(t => t.treatmentID === id);
  //     if (index !== -1) {
  //       this.treatments[index] = updatedTreatment;
  //       this.treatmentsChanged.next(this.treatments.slice());
  //     }
  //   });
  // }
  //
  // deleteTreatment(id: number) {
  //   this.treatmentDataStorageService.deleteTreatment(id).subscribe(() => {
  //     const index = this.treatments.findIndex(t => t.treatmentID === id);
  //     if (index !== -1) {
  //       this.treatments.splice(index, 1);
  //       this.treatmentsChanged.next(this.treatments.slice());
  //     }
  //   });
  // }
}
