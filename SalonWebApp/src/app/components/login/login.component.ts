import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

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

  constructor(private authService: AuthService, private userService: UserService, private router: Router) { }

  onLogin(): any {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.authService.getUserByEmail(this.email).subscribe({
          next: (userResponse) => {
            console.log('User details:', userResponse);
            this.userService.setUserDetails(userResponse); // Setarea detaliilor despre utilizator în serviciul UserService

            // După ce obținem detaliile despre utilizator, solicităm detalii despre persoană
            this.authService.getPersonDetails().subscribe({
              next: (personResponse) => {
                console.log('Person details:', personResponse);
                // Puteți salva sau utiliza detaliile despre persoană așa cum aveți nevoie
                this.router.navigate(['/home']);
              },
              error: (personError) => {
                console.error('Error fetching person details:', personError);
              }
            });
          },
          error: (userError) => {
            console.error('Error fetching user details:', userError);
          }
        });
      },
      error: (err) => {
        console.error('Login failed', err);
        this.errorMessage = 'Invalid email or password';
      }
    });
  }

  loginWithGoogle(): void {
    console.log('Google login');
  }

  loginWithFacebook(): void {
    console.log('Facebook login');
  }
}
