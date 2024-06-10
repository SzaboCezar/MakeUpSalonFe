import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {AuthService} from "./auth.service";
import {Router, RouterLink} from "@angular/router";
import {FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AuthenticationRequest} from "../shared/models/AuthenticationRequest.model";
import {LoadingSpinnerComponent} from "../components/dom-element/loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink,
    LoadingSpinnerComponent
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  isLoading = false;
  error: string = null;

  loginForm: FormGroup;

  authRequest: AuthenticationRequest = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      // 'password': new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])
      'password': new FormControl(null, [Validators.required])
    });

  }

  onSubmit() {
    console.log(this.loginForm);

    //Daca formularul nu este valid, nu facem nimic
    if(!this.loginForm.valid) {
      return;
    }

    this.authRequest = this.loginForm.getRawValue();

    this.isLoading = true;

    this.authService.login(this.authRequest).subscribe(
      response => {
        console.log(response);
        this.isLoading = false;

        this.router.navigate(['/']);
      }, errorMessage => {
        console.log("AuthComponent " + errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    )
    this.loginForm.reset();
  }

}
