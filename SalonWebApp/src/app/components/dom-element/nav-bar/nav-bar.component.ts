import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../auth/auth.service";
import {Subscription} from "rxjs";
import {NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

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
  private userSub: Subscription;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      user => {

        /*
        Același lucru cu operatorul ternar !user ? false :true;
        Poate fi scris mai simplu scis ca mai jos, care va da true, când există un user și false când nu.
         */
        this.isAuthenticated = !!user;
      }
    )
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}
