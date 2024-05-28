import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChangePasswordRequest} from "../shared/models/ChangePasswordRequestDTO.model";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  private resetPasswordURL = 'http://localhost:8080/api/users/recover-password/{id}'; // Replace with your backend login URL

  constructor(private http: HttpClient) { }

  resetPassword(changePasswordRequest: ChangePasswordRequest ): Observable<any> {
    console.log("Service: " + changePasswordRequest.id + " " + changePasswordRequest.newPassword + " " + changePasswordRequest.confirmPassword);
    return this.http.post<any>(this.resetPasswordURL, changePasswordRequest);
    // return this.http.post<any>(this.enrollmentURL, { firstName: registerRequest.firstName, lastName: registerRequest.lastName, email: registerRequest.email, password: registerRequest.password});
  }
}
