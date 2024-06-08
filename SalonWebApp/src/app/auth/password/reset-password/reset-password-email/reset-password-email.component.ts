import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router, RouterLink} from "@angular/router";
import cryptoRandomString from 'crypto-random-string';
import {ResetPasswordEmailService} from "./reset-password-email.service";
import {NgIf} from "@angular/common";


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

  constructor(
    private resetPasswordEmailService: ResetPasswordEmailService,
    private router: Router) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      user_email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

 async onSubmit() {
    // console.log(this.resetForm);
    const userEmail: string = this.resetForm.value.user_email;
    const result = await this.resetPasswordEmailService.sendResetEmail(userEmail);


    if (result.success) {
     // Handle success (e.g., show a success message)
     console.log(result.message);

      //TODO: Handle success (e.g., show a success message)
      this.emailSent = true;

      this.resetForm.reset();
    } else {
     // Handle failure (e.g., show an error message)
     console.log(result.message);
   }
  }
}
