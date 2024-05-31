import { Injectable } from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import { Treatment } from '../shared/models/Treatment.model';
import { AppointmentService } from './appointment.service';
import {LogsService} from "../logs/logs.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  treatmentsChanged = new Subject<Treatment[]>();

  private treatments: Treatment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    private logService: LogsService
  ) {
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

    //Converting the id to a number, in case it is a string.
    //It is very helpful because the API could send us a string gormat.
    treatment.treatmentID = +treatment.treatmentID;

    //ID check to be unique.
    if (this.treatments.find((h) => h.treatmentID === treatment.treatmentID)) {
      this.logService.add(
        `TreatmentService | Treatment Add: treatment with id=${treatment.treatmentID} already exists - ${Date.now()}`
      );
      throw new Error('Treatment with this id already exists');
    }

    this.treatments.push(treatment);
    this.treatmentsChanged.next(this.treatments.slice());

    this.logService.add(
      `TreatmentService | Treatment Add: added ${treatment.treatmentID}`
    );

    return of(treatment);
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
