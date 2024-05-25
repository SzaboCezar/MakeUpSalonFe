import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-enrollment',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './enrollment.component.html',
  styleUrl: './enrollment.component.css',
})
export class EnrollmentComponent implements OnInit{
  enrollmentForm: FormGroup;

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
  }
}
