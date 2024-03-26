
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/';
  private logoutEndpoint = 'http://localhost:8000/logout';

  constructor(private http: HttpClient, private router: Router) { }

  // Updated login method
  login(identifier: string, password: string) {
    const loginUrl = `${this.apiUrl}login/`;
    // The backend should be updated to handle "identifier" which could be both username or email
    return this.http.post<any>(loginUrl, { identifier, password });
  }

  signup(username: string, email: string, password: string) {
    const signupUrl = `${this.apiUrl}signup/`; // URL for signup endpoint
    return this.http.post<any>(signupUrl, { username, email, password});
  }

  
  logout() {
    this.http.post(this.logoutEndpoint, {}).subscribe(() => {
      // Clear local or session storage items
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('userToken');

      this.router.navigate(['/login']);
    }, error => {
      console.error('Logout failed', error);
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('userToken');
      this.router.navigate(['/login']);
    });
  }
}
