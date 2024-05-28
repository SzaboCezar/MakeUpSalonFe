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
  ) { }

  fetchTreatments(): Observable<Treatment[]> {
    //Just for test is hardcoded
    // Adăugați temporar un token în antetul de autorizare pentru testare
    // Definim antetul cu token-ul JWT
    const authToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJtaWhhaUBhZG1pbi5jb20iLCJpYXQiOjE3MTY5MTkyNTcsImV4cCI6MTcxNjkyMDY5N30.2QBafHLTc_-RqWnSaklYZMMza-UAlj8ADvmVRwrsJAQ";
    ;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    // Specificăm antetul în opțiunile de cerere
    const options = { headers: headers };




    return this.http.get<Treatment[]>(this.baseUrl, options).pipe(
      tap(treatments => {
        // Aici puteți face ceva cu tratamentul, dacă este necesar
        console.log(treatments)
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
