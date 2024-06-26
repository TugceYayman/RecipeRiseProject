import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model'; 

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchUrl = 'http://localhost:8000/search/'; 
  constructor(private http: HttpClient) {}

  searchRecipes(query: string): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.searchUrl}?q=${query}`);
  }
}
