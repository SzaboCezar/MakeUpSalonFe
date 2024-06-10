import { Injectable } from '@angular/core';
import { catchError, Observable, of, Subject } from 'rxjs';
import { Person } from '../shared/models/Person.model';
import { LogsService } from '../logs/logs.service';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../shared/models/Appointment.model';
import { IntervalDTO } from '../shared/models/DTO/IntervalDTO.model';
import { EmployeeTreatment } from '../shared/models/EmployeeTreatment.model';
import { User } from '../shared/models/User.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl: string = 'http://localhost:8080/api/users';

  usersChanged = new Subject<User[]>();

  private users: User[] = [];

  constructor(private logService: LogsService, private http: HttpClient) {}

  /*
   * Fetches the users from the API and sets the users in memory array.
   */
  fetchUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      tap((users) => {
        this.setUsers(users);
        console.log('UserService → fetchUsers() called');
      })
    );
  }

  setUsers(users: User[]) {
    this.users = users;
    this.usersChanged.next(this.users.slice());
  }

  getUsers() {
    return this.users.slice();
  }

  getUser(id: number): Observable<User> {
    const user = this.users.find((h) => h.userId === id) as User;
    this.logService.add(`UserService | getUser: fetched user with id=${id}`);
    return of(user);
  }

  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/role/${role}`).pipe(
      tap((users) => {
        if (!Array.isArray(users)) {
          users = [users];
        }
        return users;
      }),
      tap((users) => {
        this.setUsers(users);
        console.log('UserService → getUsersByRole() called');
      })
    );
  }
}
