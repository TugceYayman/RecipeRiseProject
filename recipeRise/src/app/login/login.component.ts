import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  usernameOrEmail: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin(): void {
    
    this.authService.login(this.usernameOrEmail, this.password).subscribe(
      data => {
        console.log('Login success', data);
        localStorage.setItem('token', data.token); // Store the token in local storage
        this.router.navigate(['/recipe-list']); // Navigate to the desired route after login
      },
      error => {
        console.error('Login failed', error);
        this.errorMessage = 'Invalid username or password'; // Set error message
      }
    );
  }
}
