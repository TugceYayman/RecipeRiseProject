import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router,
    private dialog: MatDialog,
  ) { }

  onLogin(): void {
    
    this.authService.login(this.usernameOrEmail, this.password).subscribe(
      data => {
        this.authService.storeToken(data.token);
        console.log('Login success', data);
        
      
         const userIdKey = 'userID'; // Change this to match the key in the response
        const userId = Number(data[userIdKey]);
         
        
        // // Check if the parsed ID is a number
        // if (Number.isNaN(userId)) {
        //   console.error(`User ID is not a number: ${data[userIdKey]}`);
        //   this.errorMessage = 'An error occurred during login. Please try again.';
        //   return;
        // }

        localStorage.setItem('token', data.token); // Store the token in local storage
        localStorage.setItem('username', this.usernameOrEmail);

        localStorage.setItem('userId', userId.toString());
        console.log('Stored userId', userId); // Debugging line
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Success', message: 'Logged in successfully!' },
        });

        this.router.navigate(['/recipe-list']); // Navigate to the desired route after login
      },
      error => {
        //console.error('Login failed', error);
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Fail', message: 'Login Failed!' },
        });
        this.errorMessage = 'Invalid username or password'; // Set error message
      }
    );
  }
}
