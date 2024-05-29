// src/app/app.component.ts
import {Component, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import {AuthService} from "./auth/auth.service";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule]
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
  }

}
