import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Role} from "../../../shared/models/Enum/Role.enum";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isEmployee = false;
  private userSub: Subscription;
  @Output() isAuthenticatedChange: EventEmitter<boolean> = new EventEmitter<boolean>(); // Emit evenimentul atunci când starea de autentificare se schimbă

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {

        /*
        Același lucru cu operatorul ternar !user ? false :true;
        Poate fi scris mai simplu scis ca mai jos, care va da true, când există un user și false când nu.
         */
        this.isAuthenticated = !!user;
        this.isAuthenticatedChange.emit(this.isAuthenticated); // Emit evenimentul cu noua valoare a stării de autentificare

        if (this.isAuthenticated) {
          console.log("Nav bar user role: ", (user.role ===  Role.EMPLOYEE.toUpperCase()));
          this.isEmployee = (user.role ===  Role.EMPLOYEE.toUpperCase());
        }

      }
    )
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

}
