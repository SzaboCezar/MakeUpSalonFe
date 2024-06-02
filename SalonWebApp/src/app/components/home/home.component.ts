// src/app/home/home.component.ts
import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "../dom-element/nav-bar/nav-bar.component";
import {MapComponent} from "./map/map.component";


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent, RouterLink, MapComponent],
  templateUrl: './home.component.html',
  styleUrls:  ['./Bootstrap/bootstrap.min.css', './Bootstrap/carousel.css', './home.component.css']
})
export class HomeComponent {
  isAuthenticated: boolean = false; // Variabila pentru a stoca starea de autentificare



  constructor(private router: Router) {}


  onAuthenticationChange(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }
}
