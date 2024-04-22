import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CuisineService {
  private apiUrl = 'http://localhost:8000'; 
  private cuisines!: any[]; 

  constructor(private http: HttpClient) { }

  loadCuisines(): Observable<any[]> { 
    return this.http.get<any[]>(`${this.apiUrl}/cuisines/`).pipe(
      tap(cuisines => this.cuisines = cuisines)
    );
  }

  getCuisineIdByName(cuisineName: string): number | null {
    if (!this.cuisines) {
      return null;
    }
    const cuisine = this.cuisines.find(c => c.name.toLowerCase() === cuisineName.toLowerCase());
    return cuisine ? cuisine.id : null;
  }
}  
