import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userDetails: any;

  private getUserByIdUrl = 'http://localhost:8080/api/persons/id/';
  private getUserByEmailUrl = 'http://localhost:8080/api/users/';

  constructor(private http: HttpClient) { }

  getUserByEmail(email: string, options: any): Observable<any> {
    const url = `${this.getUserByEmailUrl}${email}`; // Construiți URL-ul complet
    return this.http.get<any>(url, options); // Faceți cererea HTTP folosind HttpClient.get
  }

  setUserDetails(userDetails: any) {
    this.userDetails = userDetails;
  }

  getUserDetails() {
    return this.userDetails;
  }

}
