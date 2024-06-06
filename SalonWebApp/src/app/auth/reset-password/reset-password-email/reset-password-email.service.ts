import {Injectable} from "@angular/core";
import emailjs from '@emailjs/browser';
import cryptoRandomString from "crypto-random-string";

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordEmailService {

  constructor() { }

  async sendResetEmail(email: string): Promise<{ success: boolean; message: string }> {
    const emailToken = cryptoRandomString({ length: 12 });
    const resetLink = "http://localhost:4200/reset-password/" + email + ":" + emailToken;

    console.log("ResetPasswordEmailService | sendResetEmail | resetLink: " + resetLink);

    try {
      emailjs.init("68ldqLgvn1qddeLWF");
      const response = await emailjs.send("service_dedcvkg", "template_yfp8hxq", {
        user_name: "",
        reset_link: resetLink,
        user_email: email,
      });

      console.log('SUCCESS!', response.status, response.text);
      localStorage.setItem('emailToken', JSON.stringify({emailToken, email}));

      return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
      console.error('FAILED...', error);
      return { success: false, message: 'Failed to send email.' };
    }
  }


  checkEmailToken(email: string, emailToken: string): boolean {
   const storedEmailAndToken = JSON.parse(localStorage.getItem('emailToken'));

      if (storedEmailAndToken.email === email && storedEmailAndToken.emailToken === emailToken) {
        return true;
      } else {
        return false;
      }
  }

}
