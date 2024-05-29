import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { TreatmentService } from '../services/treatment.service';
import { Treatment } from '../shared/models/Treatment.model';
import { tap } from 'rxjs/operators';
import { Person } from '../shared/models/Person.model';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TreatmentDataStorageService {
  private baseUrl: string = 'http://localhost:8080/api/treatments';

  constructor(
    private http: HttpClient,
    private treatmentService: TreatmentService
  ) { }

  fetchTreatments(): Observable<Treatment[]> {
    //Just for test is hardcoded
    // Adăugați temporar un token în antetul de autorizare pentru testare
    // Definim antetul cu token-ul JWT
    const authToken =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0MzNAZW1haWwuY29tIiwiaWF0IjoxNzE2OTI2Mzk0LCJleHAiOjE3MTY5Mjc4MzR9.k-JdiVZubBsE7nHoGaNXFnVumfOM8enceor-F6GWWIE";

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Specificăm antetul în opțiunile de cerere
    const options = { headers: headers };




    return this.http.get<Treatment[]>(this.baseUrl, options).pipe(
      tap(treatments => {
        // Aici puteți face ceva cu tratamentul, dacă este necesar
        this.treatmentService.setTreatments(treatments);



        // console.log(treatments)
        console.log('Data stroage fetchTreatments() called');

      })
    );
  }

  getTreatmentById(id: number) {
    return this.http.get<Treatment>(`${this.baseUrl}/${id}`).pipe(
      tap(treatment => {
        // Aici puteți face ceva cu tratamentul, dacă este necesar
        console.log(treatment)
      })
    );
  }

  getPersonsByTreatmentId(id: number) {
    return this.http.get<Person[]>(`${this.baseUrl}/${id}/persons`).pipe(
      tap(persons => {
        // Aici puteți actualiza starea sau face altceva cu persoanele primite
      })
    );
  }

  addTreatment(treatment: Treatment) {
    return this.http.post<Treatment>(`${this.baseUrl}`, treatment).pipe(
      tap((newTreatment: Treatment) => {
        // Aici puteți actualiza lista de tratamente din TreatmentService, dacă este necesar
        console.log(treatment)
      })
    );
  }

  updateTreatment(id: number, treatment: Treatment) {
    return this.http.put<Treatment>(`${this.baseUrl}/${id}`, treatment).pipe(
      tap((updatedTreatment: Treatment) => {
        // Aici puteți actualiza lista de tratamente din TreatmentService, dacă este necesar
        console.log(treatment)
      })
    );
  }

  deleteTreatment(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Aici puteți actualiza lista de tratamente din TreatmentService, dacă este necesar
        console.log(`Treatment with id ${id} was deleted`);
      })
    );
  }

}
