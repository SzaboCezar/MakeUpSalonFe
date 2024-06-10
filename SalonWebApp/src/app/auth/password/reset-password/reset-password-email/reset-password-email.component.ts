import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { ResetPasswordEmailService } from "./reset-password-email.service";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-reset-password-email',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NgIf
  ],
  templateUrl: './reset-password-email.component.html',
  styleUrl: './reset-password-email.component.css'
})
export class ResetPasswordEmailComponent implements OnInit {
  resetForm: FormGroup;
  emailSent: boolean = false;
  error: string = null;

  constructor(
    private resetPasswordEmailService: ResetPasswordEmailService,
    private router: Router) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      user_email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  async onSubmit() {
    this.error = null;
    this.emailSent = false;
    const userEmail: string = this.resetForm.value.user_email;
    try {
      const result = await this.resetPasswordEmailService.sendResetEmail(userEmail);
      if (result.success) {
        this.emailSent = true;
        this.resetForm.reset();
      } else {
        this.error = result.message;
      }
    } catch (err) {
      this.error = 'An unexpected error occurred. Please try again.';
    }
  }
}
