// src/app/app.component.ts
import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import {AuthService} from "./auth/auth.service";
import {LoadingSpinnerComponent} from "./components/dom-element/loading-spinner/loading-spinner.component";
import {NgIf} from "@angular/common";
import {LoadingService} from "./services/loading.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, LoadingSpinnerComponent, NgIf]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'SalonWebApp';

  loadingSubscription: Subscription;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.loadingSubscription = this.loadingService.loading$.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    )
  }

  @HostListener('window:beforeunload', ['$event'])
  clearLocalStorage(event) {
    localStorage.removeItem('emailToken');
  }


  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }

}
