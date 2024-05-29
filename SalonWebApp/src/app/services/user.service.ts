import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "../shared/models/User.model";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userChanged = new Subject<User[]>();

    private users: User[] = [];

    constructor() { }


    setUsers(users: User[]) {
        this.users = users;
        this.userChanged.next(this.users.slice());
    }

    getUsers() {
        return this.users.slice();
    }

    getUser(index: number) {
        return this.users[index];
    }

    updateUser(index: number, newUser: User) {
        this.users[index] = newUser;
        this.userChanged.next(this.users.slice());
    }


}