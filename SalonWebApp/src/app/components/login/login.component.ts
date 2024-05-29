// src/app/login/login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service'; // Assuming you have an AuthService for login

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    // this.authService.login(this.email, this.password).subscribe({
    //   next: (response) => {
    //     console.log('Login successful', response);
    //     this.router.navigate(['/home']); // Adjust the route as necessary
    //   },
    //   error: (err) => {
    //     console.error('Login failed', err);
    //     this.errorMessage = 'Invalid email or password';
    //   }
    // });
  }

  loginWithGoogle(): void {
    // Logic for Google login
    console.log('Google login');
  }

  loginWithFacebook(): void {
    // Logic for Facebook login
    console.log('Facebook login');
  }
}
