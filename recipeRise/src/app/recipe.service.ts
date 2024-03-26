import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model'; // Define this model to match your backend structure


@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/'; // Adjust this URL to your Django server's address

  constructor(private http: HttpClient) {}

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, 'recipes/');
  }

  getCuisines(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + 'cuisines/'); // Adjust URL as necessary
  }
  

  // Implement other methods as needed, like getRecipes, updateRecipe, deleteRecipe
}
