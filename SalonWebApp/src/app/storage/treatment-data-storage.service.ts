import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreatmentService } from '../services/treatment.service';
import { Treatment } from '../shared/models/Treatment.model';
import { map, tap } from 'rxjs/operators';
import { Person } from '../shared/models/Person.model';

@Injectable({
  providedIn: 'root'
})
export class TreatmentDataStorageService {
  private baseUrl: string = 'http://localhost:8080/api/treatments';

  constructor(
    private http: HttpClient,
    private treatmentService: TreatmentService
  ) { }

  fetchTreatments() {
    return this.http.get<Treatment[]>(this.baseUrl).pipe(
      map(treatments => {
        return treatments.map(treatment => ({...treatment}));
      }),
      tap(treatments => {
        this.treatmentService.setTreatments(treatments);
      })
    );
  }

  getTreatmentById(id: number) {
    return this.http.get<Treatment>(`${this.baseUrl}/${id}`).pipe(
      tap(treatment => {
        // Aici puteți face ceva cu tratamentul, dacă este necesar
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
      })
    );
  }

  updateTreatment(id: number, treatment: Treatment) {
    return this.http.put<Treatment>(`${this.baseUrl}/${id}`, treatment).pipe(
      tap((updatedTreatment: Treatment) => {
        // Aici puteți actualiza lista de tratamente din TreatmentService, dacă este necesar
      })
    );
  }

  deleteTreatment(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        // Aici puteți actualiza lista de tratamente din TreatmentService, dacă este necesar
      })
    );
  }

}
