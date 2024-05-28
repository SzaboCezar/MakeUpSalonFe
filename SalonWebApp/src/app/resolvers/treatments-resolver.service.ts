import { Injectable } from '@angular/core';
import {TreatmentService} from "../services/treatment.service";
import {Treatment} from "../shared/models/Treatment.model";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {TreatmentDataStorageService} from "../storage/treatment-data-storage.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsResolverService implements Resolve<Treatment[]>{

  constructor(
    private treatmentDataStorageService: TreatmentDataStorageService,
    private treatmentsService: TreatmentService
  ) { }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<Treatment[]> {
    const treatments = this.treatmentsService.getTreatments();

    if (treatments.length === 0) {
      return this.treatmentDataStorageService.fetchTreatments();
    } else {
      return treatments;
    }
  }

}
