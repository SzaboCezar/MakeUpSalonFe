import { Injectable } from '@angular/core';
import {TreatmentService} from "../services/treatment.service";
import {Treatment} from "../shared/models/Treatment.model";
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {LoadingService} from "../services/loading.service";
import {tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class TreatmentsResolverService implements Resolve<Treatment[]>{

  constructor(
    private treatmentsService: TreatmentService,
    private loadingService: LoadingService
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
      this.loadingService.setLoading(true);
      console.log('Resolver fetchTreatments() called');
      return this.treatmentsService.fetchTreatments().pipe(
        tap(treatments => {
          this.loadingService.setLoading(false);
        })
      );
    } else {
      return treatments;
    }
  }

}
