import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  constructor(private authService: AuthService,
    private router: Router) { }

  onSignup(): void {
    if (this.password === this.confirmPassword) {
      this.authService.signup(this.username, this.email, this.password).subscribe(
        (response: any) => {
          alert(response.message);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          if (error.status === 400) {
            // Handle username error
            if (error.error && error.error.username && error.error.username[0].includes('custom user with this username already exists.')) {
              alert("The username is already taken. Please choose a different one.");
            }
            // Handle email error similarly if backend provides a specific message for it
            else if (error.error && error.error.email && error.error.email[0].includes('custom user with this email address already exists.')) {
              alert("The email is already taken. Please choose a different one.");
            }
            else {
              alert("There was a problem with the data you entered. Please check and try again.");
            }
          } else {
            alert("An unexpected error occurred. Please try again later.");
          }
          console.error('Error during signup', error);
        }
      );
    } else {
      alert("Passwords do not match.");
    }
  }
}    