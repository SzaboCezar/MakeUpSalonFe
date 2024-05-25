import { Injectable } from '@angular/core';
import { ChangePasswordRequest } from '../models/change-password-request.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  
  private apiUrl = 'http://localhost:8080/api/users'

  constructor(private http: HttpClient) { }

  recoverPassword(email: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/recover-password/${email}`;
    const body = {
      newPassword,
      confirmationPassword: newPassword // sau confirmationPassword: this.resetPasswordForm.value.confirmNewPassword
    };

    return this.http.patch(url, body);
  }
  getUserByEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${email}`);
  }

}
