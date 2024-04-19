import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';

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
    private router: Router, private dialog: MatDialog) { }

  onSignup(): void {
    if (this.password === this.confirmPassword) {
      this.authService.signup(this.username, this.email, this.password).subscribe(
        (response: any) => {
         // alert(response.message);
          this.dialog.open(UpdateDialogComponent, {
            data: { title: 'Success', message: 'Your account has been successfully created!' },
          });
          this.router.navigate(['/login']);
        },
        (error: any) => {
          if (error.status === 400) {
            // Handle username error
            if (error.error && error.error.username && error.error.username[0].includes('custom user with this username already exists.')) {
              this.dialog.open(UpdateDialogComponent, {
                data: { title: 'Fail', message: 'The username is already taken. Please choose a different one.' },
              });
            }
            // Handle email error similarly if backend provides a specific message for it
            else if (error.error && error.error.email && error.error.email[0].includes('custom user with this email address already exists.')) {
              this.dialog.open(UpdateDialogComponent, {
                data: { title: 'Fail', message: 'The email is already taken. Please choose a different one.' },
              });
            }
            else {
              this.dialog.open(UpdateDialogComponent, {
                data: { title: 'Fail', message: 'There was a problem with the data you entered. Please check and try again.' },
              });
            }
          } else {
            this.dialog.open(UpdateDialogComponent, {
              data: { title: 'Fail', message: 'An unexpected error occurred. Please try again later.' },
            });
          }
        }
      );
    } else {
      this.dialog.open(UpdateDialogComponent, {
        data: { title: 'Fail', message: 'Passwords do not match.' },
      });
    }
  }
}    