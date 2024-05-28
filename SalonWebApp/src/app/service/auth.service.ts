import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loginUrl = 'http://localhost:8080/api/users/login';
  private authToken: string = ''; // Variabilă pentru a stoca token-ul
  private personUrl = 'http://localhost:8080/api/persons/id/60'; // Endpoint-ul pentru persoană

  constructor(private http: HttpClient, private userService: UserService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.loginUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          this.authToken = response.token; // Salvați token-ul în variabilă
        }
      })
    );
  }

  // Adăugați token-ul în antetul de autorizare și trimiteți-l cu cererea HTTP
  getUserByEmail(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}` // Adăugați token-ul în antetul de autorizare
    });
    const options = { headers: headers };
    return this.userService.getUserByEmail(email, options); // Utilizați metoda getUserByEmail a UserService
  }

  // Noua metodă pentru a obține detalii despre persoană
  getPersonDetails(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authToken}`
    });
    return this.http.get<any>(this.personUrl, { headers });
  }
}
