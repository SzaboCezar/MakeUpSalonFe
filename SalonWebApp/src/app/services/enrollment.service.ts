import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RegisterRequestDTOModel} from "../shared/models/DTO/RegisterRequest.DTO.model";
import {AuthService} from "../auth/auth.service";
import {RegisterRequest} from "../shared/models/RegisterRequest.model";

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  // private enrollmentURL = 'http://localhost:8080/api/login/register'; // Replace with your backend login URL

  constructor(private http: HttpClient, private authService: AuthService) { }

  enroll(registerRequest: RegisterRequest): Observable<any> {
    console.log("Service: " + registerRequest.firstName + " " + registerRequest.lastName + " " + registerRequest.email + " " + registerRequest.password);
    // return this.http.post<any>(this.enrollmentURL, registerRequest);
    // return this.http.post<any>(this.enrollmentURL, { firstName: registerRequest.firstName, lastName: registerRequest.lastName, email: registerRequest.email, password: registerRequest.password});

    return this.authService.singUp(registerRequest);
  }
}
