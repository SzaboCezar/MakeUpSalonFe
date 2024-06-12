import { Injectable } from '@angular/core';
import {Resolve, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {LoadingService} from "../services/loading.service";
import {tap} from "rxjs/operators";
import {PersonService} from "../services/person.service";
import {Person} from "../shared/models/Person.model";

@Injectable({
  providedIn: 'root'
})
export class PersonsResolverService implements Resolve<Person[]>{

  constructor(
    private personsService: PersonService,
    private loadingService: LoadingService
  ) { }


  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Person[]> {
  //   return this.personsService.getPersons().pipe(
  //     take(1), // Ne asigurăm că observabilul se completează după primul eveniment emis
  //     switchMap(persons => {
  //       if (persons.length === 0) {
  //         // Dacă lista de tratamente este goală, returnăm observabilul care obține tratamentele de la server
  //         return this.treatmentDataStorageService.fetchPersons();
  //       } else {
  //         // În caz contrar, returnăm tratamentele existente
  //         return of(persons);
  //       }
  //     })
  //   );
  // }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const persons = this.personsService.getPersons();
    if (persons.length === 0) {
      this.loadingService.setLoading(true);
      console.log('Resolver fetchPersons() called');
      return this.personsService.fetchPersons().pipe(
        tap(persons => {
          this.loadingService.setLoading(false);
        })
      );
    } else {
      return persons;
    }
  }

}
