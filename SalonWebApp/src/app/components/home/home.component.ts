// src/app/home/home.component.ts
import { Component } from '@angular/core';
import {NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "../dom-element/nav-bar/nav-bar.component";
import {MapComponent} from "./map/map.component";
import {LoadingSpinnerComponent} from "../dom-element/loading-spinner/loading-spinner.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink, MapComponent, LoadingSpinnerComponent],
  templateUrl: './home.component.html',
  styleUrls:  ['./Bootstrap/bootstrap.min.css', './Bootstrap/carousel.css', './home.component.css']
})
export class HomeComponent {
  isAuthenticated: boolean = false; // Variabila pentru a stoca starea de autentificare
  isLoading: boolean = false; // Variabila pentru a stoca starea de incarcare


  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isLoading = false;
      }
    })
  }


  onAuthenticationChange(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
}
