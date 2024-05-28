import {Component, OnDestroy} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {FormGroup, FormsModule, NgForm, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnDestroy {

  enrollmentForm: FormGroup;

  isLoginMode = true;
  isLoading = false;
  error: string = null;

  private closeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit() {
    console.log(this.enrollmentForm)
    // this.registerRequest.firstName = this.enrollmentForm.get('firstName').value;
    // this.registerRequest.lastName = this.enrollmentForm.get('lastName').value;
    // this.registerRequest.email = this.enrollmentForm.get('email').value;
    // this.registerRequest.password = this.enrollmentForm.get('password').value;
  }

  ngOnDestroy() {
  }
}
