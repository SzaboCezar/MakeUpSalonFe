import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private getUserByIdUrl = 'http://localhost:8080/api/persons/id/';
  private getUserByEmailUrl = 'http://localhost:8080/api/users/';

  private userDetails: any = null;
  private personDetails: any = null;

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string, options: any): Observable<any> {
    const url = `${this.getUserByEmailUrl}${email}`; // Construiți URL-ul complet
    return this.http.get<any>(url, options); // Faceți cererea HTTP folosind HttpClient.get
  }

  setUserDetails(details: any): void {
    this.userDetails = details;
  }

  getUserDetails(): any {
    return this.userDetails;
  }

  setPersonDetails(details: any): void {
    this.personDetails = details;
  }

  getPersonDetails(): any {
    return this.personDetails;
  }
}
