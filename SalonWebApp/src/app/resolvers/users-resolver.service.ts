import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, MaybeAsync, Resolve, RouterStateSnapshot } from "@angular/router";
import { User } from "../shared/models/User.model";
import { UserDataStorageService } from "../storage/user-data-storage.service";
import { UserService } from "../services/user.service";

@Injectable({
    providedIn: 'root'
})
export class UsersResolverService implements Resolve<User[]> {

    constructor(private userDataStorageService: UserDataStorageService,
        private userService: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<User[]> {
        const users = this.userService.getUsers();

        if (users.length === 0) {
            return this.userDataStorageService.fetchUsers()
        } else {
            return users;
        }
    }

}