// src/app/home/home.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {NavBarComponent} from "../dom-element/nav-bar/nav-bar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private router: Router) {}

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToSchedule(): void {
    this.router.navigate(['/schedule']); // Assuming you have a schedule route
  }

  navigateToAccount(): void {
    this.router.navigate(['/account']); // Assuming you have an account route
  }
}
