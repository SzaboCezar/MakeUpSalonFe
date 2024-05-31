import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {RegisterRequestDTOModel} from "../../shared/models/DTO/RegisterRequest.DTO.model";
import {EnrollmentService} from "../../services/enrollment.service";
import {Router, RouterLink} from "@angular/router";
import {RegisterRequest} from "../../shared/models/RegisterRequest.model";

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css',
})
export class EnrollmentComponent implements OnInit{
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

      // 'password': new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])
      'password': new FormControl(null, [Validators.required]),

      // 'confirmPassword':  new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
      'confirmPassword': new FormControl(null, [Validators.required]),


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
        this.router.navigate(['/']); // Adjust the route as necessary
      },
      error => {
        console.log(error);
        window.alert("Error: user was not added!")
      }
    );


    //TODO: uncomment this
    // this.loginForm.reset();
  }
}
