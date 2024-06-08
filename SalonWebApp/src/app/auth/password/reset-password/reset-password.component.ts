import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PasswordService} from "../password.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {ResetPasswordEmailService} from "./reset-password-email/reset-password-email.service";
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
    private resetPasswordService: PasswordService,
    private resetPasswordEmailService: ResetPasswordEmailService,
    private router: Router,
    private route: ActivatedRoute) {}

  //TODO: enable validators.
  ngOnInit(): void {
    this.getParams();

    if(this.resetPasswordEmailService.checkEmailToken(this.email, this.emailToken)) {
      this.areParamsValid = true;
      this.resetForm = new FormGroup({
        // newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
        newPassword: new FormControl(null, Validators.required),
        // confirmPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])
        confirmationPassword: new FormControl(null, Validators.required)
      });
    }
  }

  onSubmit() {
    console.log(this.resetForm);
    const resetPasswordRequest: ResetPasswordRequest = this.resetForm.getRawValue();
    console.log("ResetPasswordComponent |Reset password request: ", resetPasswordRequest)


    this.resetPasswordService.resetPassword(resetPasswordRequest, this.email).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/auth']);
      },
      error => {
        console.log(error);
        this.error = "Error: password was not reset!";
      }
    );
  }

  getParams() {
    this.route.paramMap.subscribe(params => {
      const emailAndToken = params.get('emailAndToken');
      if (emailAndToken) {
        const [email, token] = this.extractEmailAndToken(emailAndToken);
        this.email = email;
        this.emailToken = token;
        console.log('Email:', this.email);
        console.log('Token:', this.emailToken);
      }
    });
  }

  extractEmailAndToken(emailAndToken: string): [string, string] {
    const [email, token] = emailAndToken.split(':');
    return [decodeURIComponent(email), token];
  }
}
