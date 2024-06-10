import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EnrollmentService} from "../../services/enrollment.service";
import {Router, RouterLink} from "@angular/router";
import {RegisterRequest} from "../../shared/models/RegisterRequest.model";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css',
})
export class EnrollmentComponent implements OnInit{
  error: string = null;
  emailExists: boolean = false;

  registerRequest: RegisterRequest = {
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    phoneNumber: null,
    dateOfBirth: null,
    address: null,
    pictureURL: null
  };
  enrollmentForm: FormGroup;

  constructor(private enrollmentService: EnrollmentService, private router: Router) {
  }

  ngOnInit() {
    this.enrollmentForm = new FormGroup({
      'firstName': new FormControl(null, Validators.required),
      'lastName': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      'confirmPassword':  new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      'agreeTerms': new FormControl(false)
    });
  }

  onSubmit() {

    if (this.enrollmentForm.get('password').value !== this.enrollmentForm.get('confirmPassword').value) {
      this.error = 'Passwords do not match!';
      return;
    }

    console.log(this.enrollmentForm)

    this.registerRequest.firstName = this.enrollmentForm.get('firstName').value;
    this.registerRequest.lastName = this.enrollmentForm.get('lastName').value;
    this.registerRequest.email = this.enrollmentForm.get('email').value;
    this.registerRequest.password = this.enrollmentForm.get('password').value;


    this.enrollmentService.enroll(this.registerRequest).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/']); // Adjust the route as necessary
      },
      error => {
        if (error.message === 'The email is already in use') {
          this.emailExists = true;
        }
        this.error = error.message;
      }
    );

    this.enrollmentForm.reset();
  }
}
