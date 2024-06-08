import { Component } from '@angular/core';
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {PasswordService} from "../password.service";
import {Location} from "@angular/common";
import {ChangePasswordRequest} from "../../../shared/models/DTO/ChangePasswordRequestDTO.model";

@Component({
  selector: 'app-change-password',
  standalone: true,
    imports: [
        NgIf,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  changeForm: FormGroup;
  error: string = null;
  success: string = null;

  constructor(
    private passwordService: PasswordService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {}

  //TODO: enable validators.
  ngOnInit(): void {

    if(this.passwordService.checkUserId()) {
      console.log("Change Password Component | ngOnInit() | userId: ", this.passwordService.checkUserId());
      this.changeForm = new FormGroup({
        // newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)]),
        newPassword: new FormControl(null, Validators.required),
        // confirmPassword: new FormControl(null, [Validators.required, Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/)])
        confirmationPassword: new FormControl(null, Validators.required)
      });
    } else {
      //Dacă nu există un ID de utilizator, navighează înapoi la pagina de autentificare pentru a evita eventual errori.
      this.router.navigate(['/auth']);
    }
  }

  onSubmit() {
    console.log(this.changeForm);
    const changePasswordRequest: ChangePasswordRequest = this.changeForm.getRawValue();
    console.log("Change Password Component | changePasswordRequest: ", changePasswordRequest);

    this.passwordService.changePassword(changePasswordRequest,).subscribe(
      data => {
        console.log(data);
        this.router.navigate(['/']);
      },
      error => {
        console.log(error);
        this.error = "Error: password was not changed!";
      }
    );
  }

  onCancel(): void {
    this.location.back();
  }
}
