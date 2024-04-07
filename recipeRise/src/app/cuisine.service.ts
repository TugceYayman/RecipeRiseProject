import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuisineService {
  private apiUrl = 'http://localhost:8000'; // Adjust with your API endpoint
  private cuisines!: any[]; // Ideally, use a Cuisine model instead of any

  constructor(private http: HttpClient) { }

  loadCuisines(): Observable<any[]> { // Replace 'any' with your Cuisine model
    return this.http.get<any[]>(`${this.apiUrl}/cuisines/`).pipe(
      tap(cuisines => this.cuisines = cuisines)
    );
  }

  getCuisineIdByName(cuisineName: string): number | null {
    if (!this.cuisines) {
      // Handle the case where cuisines aren't loaded yet, e.g., return null or throw an error
      return null;
    }
    const cuisine = this.cuisines.find(c => c.name.toLowerCase() === cuisineName.toLowerCase());
    return cuisine ? cuisine.id : null;
  }
}  
