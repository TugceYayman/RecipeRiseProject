// user.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/'; // Adjust to match your API

  constructor(private http: HttpClient) {}

  updateProfilePicture(userId: number, imageFile: File): Observable<any> {
    const url = `${this.apiUrl}users/update_profile_pic/${userId}/`;
    const formData = new FormData();
    formData.append('profile_picture', imageFile);
    return this.http.put(url, formData); // No need for headers, FormData sets them
  }
}
