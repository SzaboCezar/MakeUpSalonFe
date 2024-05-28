import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ResetPasswordService} from "../../services/reset-password.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;

  constructor(private resetPasswordService: ResetPasswordService, private router: Router) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      id: new FormControl(null, Validators.required),
      newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      confirmPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])
    });
  }

  onSubmit() {
    console.log(this.resetForm);
    this.resetPasswordService.resetPassword(this.resetForm.getRawValue()).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/login']); // Adjust the route as necessary
      },
      error => {
        console.log(error);
        window.alert("Error: password was not reset!")
      }
    );
  }

}
