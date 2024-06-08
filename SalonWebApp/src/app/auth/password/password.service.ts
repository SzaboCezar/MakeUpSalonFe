import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChangePasswordRequest } from "../../shared/models/DTO/ChangePasswordRequestDTO.model";
import {ResetPasswordRequest} from "../../shared/models/ResetPasswordRequest.model";

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private resetPasswordURL = 'http://localhost:8080/api/users/recover-password/email/';

  constructor(private http: HttpClient) { }

  resetPassword(resetPasswordRequest: ResetPasswordRequest, email: string): Observable<any> {
    const url = `${this.resetPasswordURL}${email}`; // Construiește URL-ul complet cu adresa de email




    console.log("Reset Password Service | resetPasswordRequest: ", resetPasswordRequest);
    localStorage.removeItem('emailToken');

    console.log("Service: ", url);

    // Trimite cererea HTTP către API-ul backend
    return this.http.patch<any>(url, resetPasswordRequest)
      .pipe(
        catchError(error => {
          // Tratează erorile și emite eroarea mai departe
          console.error("A apărut o eroare în timpul apelului HTTP:", error);
          return throwError(error);
        })
      );
  }
}
