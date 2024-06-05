import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ResetPasswordService} from "../../../services/reset-password.service";
import {Router, RouterLink} from "@angular/router";
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-reset-password-email',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './reset-password-email.component.html',
  styleUrl: './reset-password-email.component.css'
})
export class ResetPasswordEmailComponent implements OnInit {
  resetForm: FormGroup;

  constructor(private resetPasswordService: ResetPasswordService, private router: Router) {}

  ngOnInit(): void {
    this.resetForm = new FormGroup({
      user_email: new FormControl(null, [Validators.required, Validators.email]),
    });
  }

  onSubmit() {
    console.log(this.resetForm);

    emailjs.init("68ldqLgvn1qddeLWF");
    emailjs.send("service_dedcvkg","template_yfp8hxq",{
      user_name: "",
      reset_link: "test_link",
      user_email: this.resetForm.value.user_email,
    });

    alert("Email sent!")
    console.log(this.resetForm.value.user_email);
    this.resetForm.reset();
    // this.resetPasswordService.resetPassword(this.resetForm.getRawValue()).subscribe(
    //   data => {
    //     console.log(data);
    //     this.router.navigate(['/login']); // Adjust the route as necessary
    //   },
    //   error => {
    //     console.log(error);
    //     window.alert("Error: password was not reset!")
    //   }
    // );
  }
}
