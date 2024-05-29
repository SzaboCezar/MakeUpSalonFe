// src/app/services/authentification.services.ts
import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, throwError} from 'rxjs';
import {AuthenticationRequest} from "../shared/models/AuthenticationRequest.model";
import {RegisterRequest} from "../shared/models/RegisterRequest.model";
import {AuthenticationResponse} from "../shared/models/AuthenticationResponse.model";
import {tap} from "rxjs/operators";
import {User} from "../shared/models/User.model";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //Emite un user la login sau la logut. Îl folosim pentru a ști dacă userul este logat sau nu.
  //BehaviorSubject față de un Subject simplu reține ultima valoare emisă, astfel încât să o poată emite la abonare.
  //Mia exact, nu trebuie ca userul să se logheze în același timp când face un query pe BE, ci se poate loga înainte de
  //aceasta (e.g. face log in, dar fetch-ul datelor se face mai târziu).
  user = new BehaviorSubject<User | null>(null);


  private loginUrl = 'http://localhost:8080/api/users/login'; // Replace with your backend login URL

  constructor(private http: HttpClient) { }

  // login(email: string, password: string): Observable<any> {
  //   return this.http.post<any>(this.loginUrl, { email, password });
  // }

  login(authenticationRequest: AuthenticationRequest): Observable<any> {
    return this.http.post<AuthenticationResponse>('http://localhost:8080/api/users/login', authenticationRequest)
      .pipe(
        catchError(this.handleError),
        tap(response => {
          this.handleAuthentication(response);
        })

      );
  }


  singUp(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post<AuthenticationResponse>('http://localhost:8080/api/users/register', registerRequest);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    return throwError(errorMessage);
  }

  private handleAuthentication(token: string) {
    console.log(token)

    const authToken: AuthenticationResponse  = {
      token: token
    }

    const user: User = new User(0, '', '', null, null, false, false, false, false, authToken);

    //Emitem user-ul care s-a logat, cu token-ul în el.
    this.user.next(user);
  }
}
