import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegisterRequestDTOModel} from "../../models/RegisterRequest.DTO.model";
import {EnrollmentService} from "../../service/enrollment.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css',
})
export class EnrollmentComponent implements OnInit{
  registerRequest: RegisterRequestDTOModel = {
    firstName: '',
    lastName: '',
    email: '',
    password: ''
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
    console.log(this.enrollmentForm)
    // this.registerRequest.firstName = this.enrollmentForm.get('firstName').value;
    // this.registerRequest.lastName = this.enrollmentForm.get('lastName').value;
    // this.registerRequest.email = this.enrollmentForm.get('email').value;
    // this.registerRequest.password = this.enrollmentForm.get('password').value;

    this.registerRequest = this.enrollmentForm.getRawValue()

    // this.enrollmentService.enroll(this.registerRequest).subscribe(
    //   data => console.log(data)
    // );

    this.enrollmentService.enroll(this.registerRequest).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/login']); // Adjust the route as necessary
      },
      error => {
        console.log(error);
        window.alert("Error: user was not added!")
      }
    );

  }
}
