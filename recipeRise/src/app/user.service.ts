
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service'; 

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

 // updateProfilePicture(userId: number, imageFile: File): Observable<any> {
    ///const url = `${this.apiUrl}users/update_profile_pic/${userId}/`;
   // const formData = new FormData();
   // formData.append('profile_picture', imageFile);
   // return this.http.put(url, formData);
  // }
  
  updateProfilePicture(userId: number, imageFile: File): Observable<any> {
    const url = `http://127.0.0.1:8000/users/update_profile_pic/${userId}/`; // Replace with the actual URL
    const formData = new FormData();
    formData.append('profile_picture', imageFile);
    return this.http.put(url, formData, {
      headers: {
        'Authorization': `Token ${this.authService.getToken()}` // Correctly getting the token from AuthService
      }
    });
  }

  deleteUser(userId: number) {
    // Correct the URL to include the user ID and point to the correct backend endpoint
    return this.http.delete(`http://localhost:8000/api/users/delete/${userId}/`, { withCredentials: true });
  }
  
}
