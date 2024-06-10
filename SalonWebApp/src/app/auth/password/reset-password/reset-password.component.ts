import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PasswordService} from "../password.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {ResetPasswordRequest} from "../../../shared/models/ResetPasswordRequest.model";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  email: string;
  emailToken: string;
  areParamsValid: boolean = false;
  error: string = null;

  constructor(
    private passwordService: PasswordService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getParams();

    this.resetForm = new FormGroup({
      newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/)]),
      confirmationPassword: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    if (this.resetForm.get('newPassword').value !== this.resetForm.get('confirmationPassword').value) {
      this.error = 'Passwords do not match!';
      return;
    }

    const resetPasswordRequest: ResetPasswordRequest = this.resetForm.getRawValue();

    this.passwordService.resetPassword(resetPasswordRequest, this.email).subscribe(
      () => {
        this.router.navigate(['/auth']);
      },
      (error) => {
        if (error.status === 400) {
          this.error = 'Invalid request. Please check your input.';
        } else if (error.status === 404) {
          this.error = 'Resource not found. Please try again later.';
        } else {
          this.error = 'An unexpected error occurred. Please try again later.';
        }
      }
    );
  }

  getParams() {
    this.route.paramMap.subscribe(params => {
      const emailAndToken = params.get('emailAndToken');
      if (emailAndToken && this.passwordService.checkEmailTokenInLocalStorage()) {
        const [email, token] = this.extractEmailAndToken(emailAndToken);
        this.email = email;
        this.emailToken = token;
        this.areParamsValid = true;
      } else {
        this.error = 'No email and token provided. Please try again.'
      }
    });
  }

  private extractEmailAndToken(emailAndToken: string): [string, string] {
    const [email, token] = emailAndToken.split(':');
    return [decodeURIComponent(email), token];
  }

}
