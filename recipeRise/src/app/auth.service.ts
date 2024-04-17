import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/';
  private logoutEndpoint = 'http://localhost:8000/logout';

  constructor(private http: HttpClient, private router: Router) { }

  getLoggedInUserId(): number | null {
    const token = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user.id;
    } else {
      return null;
    }
  }
  

  login(username: string, password: string) {
    const loginUrl = `${this.apiUrl}login/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); // Specify JSON headers
    return this.http.post<any>(loginUrl, { username, password }, { headers });
  }

  signup(username: string, email: string, password: string) {
    const signupUrl = `${this.apiUrl}signup/`; // URL for signup endpoint
    return this.http.post<any>(signupUrl, { username, email, password });
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
      localStorage.removeItem('token');
      sessionStorage.removeItem('userToken');
      this.router.navigate(['/login']);
    });
  }

  // Store token in local storage
  storeToken(token: string) {
    localStorage.setItem('userToken', token);
  }

  // Get token from local storage
  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  // Check if user is logged in
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  changePassword(currentPassword: string, newPassword: string) {
    const url = 'http://localhost:8000/users/change_password/'; // Adjust to your backend URL
    const body = { current_password: currentPassword, new_password: newPassword };
    return this.http.put(url, body); // Assuming you're using HttpClient
  }
}
