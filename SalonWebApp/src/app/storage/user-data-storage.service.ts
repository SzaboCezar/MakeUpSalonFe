import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { AuthService } from "../auth/auth.service";
import { Observable, tap } from "rxjs";
import { User } from "../shared/models/User.model";


@Injectable({
    providedIn: 'root'
})
export class UserDataStorageService {
    private baseUrl: string = "http://localhost:8080/api/users"

    constructor(private http: HttpClient,
        private userService: UserService,
        private authService: AuthService
    ) { }

    fetchUsers(): Observable<User[]> {
        console.log("User-data-storage service");

        return this.http.get<User[]>(this.baseUrl)
            .pipe(
                tap(users => {
                    this.userService.setUsers(users);
                    console.log("Users ", users);

                })
            );
    }



}
