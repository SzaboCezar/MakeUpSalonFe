import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { Treatment } from '../shared/models/Treatment.model';
import { AppointmentService } from './appointment.service';

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  treatmentsChanged = new Subject<Treatment[]>();

  private treatments: Treatment[] = [];

  constructor(
    private appointmentService: AppointmentService,
    // private treatmentDataStorageService: TreatmentDataStorageService
  ) {
    // this.treatmentDataStorageService.fetchTreatments().subscribe((treatments: Treatment[]) => {
    //   this.setTreatments(treatments);
    // });
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

  addTreatment(treatment: Treatment) {
    this.treatments.push(treatment);
    this.treatmentsChanged.next(this.treatments.slice());
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
