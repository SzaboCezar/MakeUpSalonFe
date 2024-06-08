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
  private changePasswordURL = 'http://localhost:8080/api/users/recover-password/id/';


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

  changePassword(changePasswordRequest: ChangePasswordRequest): Observable<any> {
    console.log("Change Password Service | changePasswordRequest: ", changePasswordRequest);
// Obține valoarea din local storage asociată cheii "userData" și parsează-o direct pentru a prelua ID-ul utilizatorului
    var userId = JSON.parse(localStorage.getItem("userData")).userId;

// Verifică dacă userId există și afișează-l în consolă
    if (userId !== undefined && userId > 0) {
      console.log("ID-ul utilizatorului este:", userId);
      const url = `${this.changePasswordURL}${userId}`; // Construiește URL-ul complet cu adresa de email
      return this.http.patch<any>(url, changePasswordRequest)
        .pipe(
          catchError(error => {
            console.error("A apărut o eroare în timpul apelului HTTP:", error);
            return throwError(error);
          })
        );
    } else {
      console.log("ID-ul utilizatorului nu este disponibil în local storage.");
      throw new Error("ID-ul utilizatorului nu este disponibil în local storage.");
    }
  }


  checkUserId(): boolean {
    const userId = JSON.parse(localStorage.getItem("userData")).userId;
    if (userId !== undefined && userId > 0) {
      return true;
    } else {
      return false;
    }
  }













}
