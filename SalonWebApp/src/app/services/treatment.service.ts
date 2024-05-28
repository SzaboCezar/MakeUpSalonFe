import { Injectable } from '@angular/core';
import {Subject} from "rxjs";
import {Treatment} from "../shared/models/Treatment.model";
import {AppointmentService} from "./appointment.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  treatmentsChanged = new Subject<Treatment[]>();

  private treatments: Treatment[] = [];


  /*
  Can be used for dependency injection (e.g give another services that is needed to be accessed by this services).
   */
  constructor(private appointmentService: AppointmentService) { }

  /*
  This method is used to set the treatments array to the treatments array that is passed in.
  It is best practice to work only with a copy ("slice") of the array, so that the original array is not changed by mistake.
   */
  setTreatments(treatments: Treatment[]) {
    this.treatments = treatments;
    this.treatmentsChanged.next(this.treatments.slice());
  }

  //Read
  getTreatments() {
    return this.treatments.slice();
  }

  //Read one
  getTreatment(index: number) {
    return this.treatments[index];
  }

  //Add to appointment ("shopping cart")
  addTreatmentsToAppointment(treatments: Treatment[]) {
    this.appointmentService.addTreatments(treatments);
  }

  //Create
  addTreatment(treatment: Treatment) {
    this.treatments.push(treatment);
    this.treatmentsChanged.next(this.treatments.slice());
  }

  //Update
  updateTreatment(index: number, newTreatment: Treatment) {
    this.treatments[index] = newTreatment;
    this.treatmentsChanged.next(this.treatments.slice());
  }

  //Delete
  deleteTreatment(index: number) {
    this.treatments.splice(index, 1);
    this.treatmentsChanged.next(this.treatments.slice());
  }
}
