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
        
      
         const userIdKey = 'userID'; 
        const userId = Number(data[userIdKey]);
         

        localStorage.setItem('token', data.token); 
        localStorage.setItem('username', this.usernameOrEmail);

        localStorage.setItem('userId', userId.toString());
        console.log('Stored userId', userId); 
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Success', message: 'Logged in successfully!' },
        });

        this.router.navigate(['/recipe-list']); 
      },
      error => {
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Fail', message: 'Login Failed!' },
        });
        this.errorMessage = 'Invalid username or password'; 
      }
    );
  }
}
