import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { RegisterRequestDTOModel } from "../models/RegisterRequest.DTO.model";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private enrollmentURL = 'http://localhost:8080/api/users/register'; // Replace with your backend login URL

  constructor(private http: HttpClient) { }

  enroll(registerRequest: RegisterRequestDTOModel): Observable<any> {
    console.log("Service: " + registerRequest.firstName + " " + registerRequest.lastName + " " + registerRequest.email + " " + registerRequest.password);
    return this.http.post<any>(this.enrollmentURL, registerRequest);
    // return this.http.post<any>(this.enrollmentURL, { firstName: registerRequest.firstName, lastName: registerRequest.lastName, email: registerRequest.email, password: registerRequest.password});
  }
}
