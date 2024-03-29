import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model'; // Adjust this path as necessary
import { Cuisine } from './cuisine.model'; // Define this model to match your backend structure

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('userToken'); // Replace 'userToken' with the key you use to store the token
    return {
      headers: {
        Authorization: `Token ${token}`
      }
    };
  }

  addRecipe(recipeData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}recipes/`, recipeData);
  }

  getCuisines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cuisines/`);
  }
  // Implement other methods as needed, like getRecipes, updateRecipe, deleteRecipe
}
