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
    // Assuming you have stored the user ID in local storage at the time of login
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }
  
  

  login(username: string, password: string) {
    const loginUrl = `${this.apiUrl}login/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' }); 
    return this.http.post<any>(loginUrl, { username, password }, { headers });
  }

  signup(username: string, email: string, password: string) {
    const signupUrl = `${this.apiUrl}signup/`; 
    return this.http.post<any>(signupUrl, { username, email, password });
  }

  logout() {
    this.http.post(this.logoutEndpoint, {}).subscribe(() => {
      
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

  storeToken(token: string) {
    localStorage.setItem('userToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  changePassword(currentPassword: string, newPassword: string) {
    const url = 'http://localhost:8000/users/change_password/'; 
    const body = { current_password: currentPassword, new_password: newPassword };
    return this.http.put(url, body); 
  }
}
