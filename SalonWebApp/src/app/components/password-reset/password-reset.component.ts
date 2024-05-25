import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PasswordResetService } from '../../service/password-reset.service';
import { ChangePasswordRequest } from '../../models/change-password-request.dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {
  resetPasswordForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: PasswordResetService
  ) {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmNewPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(formGroup: FormGroup) {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmNewPassword = formGroup.get('confirmNewPassword')?.value;

    if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
      return { mismatch: true };
    } else {
      return null;
    }
  }

  onSubmit() {
    console.log('Form submitted');
    if (this.resetPasswordForm.valid) {
      console.log('Form is valid');
      const email = this.resetPasswordForm.value.email;
      const newPassword = this.resetPasswordForm.value.newPassword;
      const changePasswordRequest: ChangePasswordRequest = {
        newPassword,
        confirmationPassword: newPassword
      };

      this.userService.recoverPassword(email, newPassword).subscribe({
        next: (response) => {
          console.log('Password successfully reset', response);
          this.resetPasswordForm.reset(); // Golește formularul
          this.successMessage = 'Password successfully reset'; // Afișează mesajul de succes
          this.errorMessage = ''; // Asigură-te că nu există niciun mesaj de eroare
          setTimeout(() => {
            this.router.navigate(['/login']); // Redirecționează către homepage după câteva secunde
          }, 3000); // Redirecționează după 3 secunde (3000 milisecunde)
        },
        error: (error) => {
          console.error('Error resetting password', error);
          this.successMessage = ''; // Asigură-te că nu există niciun mesaj de succes
          this.errorMessage = 'Error resetting password'; // Afișează mesajul de eroare
        },
        complete: () => {
          console.log('Password reset request completed');
        }
      });
    } else {
      console.log('Form is invalid');
      this.resetPasswordForm.reset();
      // Afișează mesaje de eroare sau alte acțiuni necesare pentru formularul invalid
    }
  }
}