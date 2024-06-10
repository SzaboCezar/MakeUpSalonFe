import { Injectable } from "@angular/core";
import emailjs from '@emailjs/browser';
import cryptoRandomString from "crypto-random-string";
import { LoadingService } from "../../../../services/loading.service";
import { AuthService } from "../../../auth.service";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordEmailService {
  constructor(
    private loadingService: LoadingService,
    private authService: AuthService
  ) { }

  async sendResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    const emailToken = cryptoRandomString({ length: 12 });
    const resetLink = "http://localhost:4200/reset-password/" + email + ":" + emailToken;

    console.log("ResetPasswordEmailService | sendResetEmail | resetLink: " + resetLink);

    this.loadingService.setLoading(true);

    try {
      const userExists = await this.checkEmailIfExists(email);
      if (!userExists) {
        return { success: false, message: 'Email address not found. Please check and try again.' };
      }

      emailjs.init("68ldqLgvn1qddeLWF");
      const response = await emailjs.send("service_dedcvkg", "template_yfp8hxq", {
        user_name: "",
        reset_link: resetLink,
        user_email: email,
      });

      console.log('SUCCESS!', response.status, response.text);
      localStorage.setItem('emailToken', JSON.stringify({ emailToken, email }));

      return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
      console.error('FAILED...', error);

      if (error.status === 400) {
        return { success: false, message: 'Invalid email address. Please check and try again.' };
      } else if (error.status === 429) {
        return { success: false, message: 'Too many requests. Please try again later.' };
      } else {
        return { success: false, message: 'An unexpected error occurred. Please try again.' };
      }
    } finally {
      this.loadingService.setLoading(false);
    }
  }

  checkEmailToken(email: string, emailToken: string): boolean {
    const storedEmailAndToken = JSON.parse(localStorage.getItem('emailToken'));

    if (storedEmailAndToken && storedEmailAndToken.email === email && storedEmailAndToken.emailToken === emailToken) {
      return true;
    } else {
      return false;
    }
  }

  async checkEmailIfExists(email: string): Promise<boolean> {
    try {
      const userExists = await this.authService.checkUserExists(email).toPromise();
      return userExists;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }
}
