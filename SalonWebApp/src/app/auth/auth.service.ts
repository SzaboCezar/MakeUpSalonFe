// src/app/services/authentification.services.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {BehaviorSubject, catchError, Observable, of, switchMap, throwError} from 'rxjs';
import { AuthenticationRequest } from '../shared/models/AuthenticationRequest.model';
import { RegisterRequest } from '../shared/models/RegisterRequest.model';
import { AuthenticationResponse } from '../shared/models/AuthenticationResponse.model';
import {map, tap} from 'rxjs/operators';
import { User } from '../shared/models/User.model';
import { Router } from '@angular/router';
import { Role } from '../shared/models/Enum/Role.enum';
import { Person } from '../shared/models/Person.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //Emite un user la login sau la logut. Îl folosim pentru a ști dacă userul este logat sau nu.
  //BehaviorSubject față de un Subject simplu reține ultima valoare emisă, astfel încât să o poată emite la abonare.
  //Mia exact, nu trebuie ca userul să se logheze în același timp când face un query pe BE, ci se poate loga înainte de
  //aceasta (e.g. face log in, dar fetch-ul datelor se face mai târziu).
  user = new BehaviorSubject<User | null>(null);

  //BE token expiration function: setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
  tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(authenticationRequest: AuthenticationRequest): Observable<any> {
    return this.http
      .post<AuthenticationResponse>(
        'http://localhost:8080/api/auth/login',
        authenticationRequest
      )
      .pipe(
        catchError(this.handleError),
        tap((response) => {
          this.handleAuthentication(response.token);
        })
      );
  }

  autoLogin() {
    const userData: {
      userId: number;
      email: string;
      password: string;
      role: Role;
      person: Person;
      accountNonExpired: boolean;
      accountNonLocked: boolean;
      credentialsNonExpired: boolean;
      enabled: boolean;
      _token: string;
      expirationTime: number;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    console.log('AuthService userData: ', userData);

    const userDataToken = userData._token;
    console.log('AuthService userDataToken: ', userDataToken);

    const loadedUser: User = new User(
      userData.userId,
      userData.email,
      userData.password,
      userData.role,
      userData.person,
      userData.accountNonExpired,
      userData.accountNonLocked,
      userData.credentialsNonExpired,
      userData.enabled,
      userData._token
    );

    console.log('AuthService loaded user: ', loadedUser);

    if (loadedUser.token) {
      this.user.next(loadedUser);

      // Calculăm durata rămasă până la expirarea token-ului
      const expirationDuration: number =
        userData.expirationTime - new Date().getTime();
      console.log('Expiration duration autoLogOut: ', expirationDuration);

      // Inițiem automat logout-ul după expirarea token-ului
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');
    this.router.navigate(['/']);

    /*
     * For auto logout.
     * Dacă user-ul se deloghează manual, trebuie să ștergem timer-ul de logout automat.
     */
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /*
   * Setează un timer pentru a face logout automat după ce token-ul expiră.
   * Token-ul expiră pe BE în 24 de minute de la apelarea login-ului.
   */
  autoLogout(expirationDuration: number) {
    console.log('Expiration duration: ', expirationDuration);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
  singUp(registerRequest: RegisterRequest): Observable<any> {
    return this.checkUserExists(registerRequest.email).pipe(
      switchMap((userExists) => {
        if (userExists) {
          console.log('User already exists!');
          throw new Error('The email is already in use'); // Mesajul de eroare personalizat pentru eroarea de la înregistrare
        } else {
          return this.http.post<AuthenticationResponse>(
            'http://localhost:8080/api/auth/register',
            registerRequest
          ).pipe(
            catchError(error => {
              console.error('An error occurred during registration:', error);
              throw new Error('Registration failed, please try again later.'); // Mesajul de eroare personalizat pentru eroarea de la înregistrare
            }),
            tap((response) => {
              this.handleAuthentication(response.token);
            })
          );
        }
      })
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Invalid email or password!';
    return throwError(errorMessage);
  }

  private async handleAuthentication(token: string) {
    const user: User = new User(
      0,
      '',
      '',
      null,
      null,
      false,
      false,
      false,
      false,
      token
    );

    //Emitem user-ul care s-a logat, cu token-ul în el.
    this.user.next(user);

    const email = this.extractEmailFromToken(token);
    const fetchedUser = await this.fetchUserByEmail(email);

    user.userId = fetchedUser.userId;
    user.email = fetchedUser.email;
    user.role = fetchedUser.role;
    user.person = fetchedUser.person;
    user.accountNonExpired = fetchedUser.accountNonExpired;
    user.accountNonLocked = fetchedUser.accountNonLocked;
    user.credentialsNonExpired = fetchedUser.credentialsNonExpired;
    user.enabled = fetchedUser.enabled;

    console.log('Emitted user: ');
    console.log(user);

    //For auto logout
    // Calculăm timpul la care token-ul va expira în cazul autoLogIn, din local storage.
    const expirationTime = new Date().getTime() + 1000 * 60 * 20; // Token-ul expiră în 20 minute

    // Calculăm durata până la expirare pentru logIn făcut de user.
    const expirationDuration = expirationTime - new Date().getTime();

    // Setăm un timer pentru a face logout automat după ce token-ul expiră
    this.autoLogout(expirationDuration);

    //Trimitem user-ul în localStorage pentru a-l putea folosi și după refresh
    localStorage.setItem(
      'userData',
      JSON.stringify({ ...user, expirationTime })
    );
  }

  private extractEmailFromToken(token: string): string {
    // Split the token into its three parts
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }

    // Decode the payload part
    const payload = tokenParts[1];
    const decodedPayload = atob(payload);
    const payloadObj = JSON.parse(decodedPayload);

    // Extract and return the email
    return payloadObj.sub;
  }

  private getUserByEmail(email: string): Observable<User> {
    const url = `http://localhost:8080/api/users/${email}`;
    return this.http.get<User>(url);
  }

  private async fetchUserByEmail(email: string): Promise<User> {
    try {
      return await firstValueFrom(this.getUserByEmail(email));
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  public checkUserExists(email: string): Observable<boolean> {
    return this.getUserByEmail(email).pipe(
      map(user => true), // If we get a user, return true
      catchError(error => {
        if (error.status === 404) {
          // If we receive a 404 status (Not Found), it means the user does not exist
          return of(false);
        } else {
          // Otherwise, handle the error without rethrowing it
          throw new Error('An error occurred while verifying the user', error);
          // You can do anything else necessary with the error here
        }
      })
    );
  }

  isEmployee(): boolean {
      const role: Role = this.getUserRole();
      return role === Role.EMPLOYEE.toUpperCase()
  }

  private getUserRole(): Role {
    return JSON.parse(localStorage.getItem("userData")).role;
  }
}
