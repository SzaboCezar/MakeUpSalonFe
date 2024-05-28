import { Injectable } from '@angular/core';
import {TreatmentService} from "../services/treatment.service";
import {Treatment} from "../shared/models/Treatment.model";
import {ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot} from "@angular/router";
import {TreatmentDataStorageService} from "../storage/treatment-data-storage.service";
import {Observable, of, switchMap, take} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsResolverService implements Resolve<Treatment[]>{

  constructor(
    private treatmentDataStorageService: TreatmentDataStorageService,
    private treatmentsService: TreatmentService
  ) { }


  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Treatment[]> {
  //   return this.treatmentsService.getTreatments().pipe(
  //     take(1), // Ne asigurăm că observabilul se completează după primul eveniment emis
  //     switchMap(treatments => {
  //       if (treatments.length === 0) {
  //         // Dacă lista de tratamente este goală, returnăm observabilul care obține tratamentele de la server
  //         return this.treatmentDataStorageService.fetchTreatments();
  //       } else {
  //         // În caz contrar, returnăm tratamentele existente
  //         return of(treatments);
  //       }
  //     })
  //   );
  // }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const treatments = this.treatmentsService.getTreatments();

    if (treatments.length === 0) {
      return this.treatmentDataStorageService.fetchTreatments();
    } else {
      return of(treatments);
    }
  }

}
