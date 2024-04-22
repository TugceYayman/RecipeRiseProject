import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Recipe } from './models/recipe.model'; 

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private apiUrl = 'http://localhost:8000/';

  constructor(private http: HttpClient) {}

  private getHttpOptions() {
    const token = localStorage.getItem('userToken'); 
    return {
      headers: {
        Authorization: `Token ${token}`
      }
    };
  }

  getRandomRecipes(): Observable<any> {
    return this.http.get(`${this.apiUrl}recipes/random/`);
  }
  
  addRecipe(recipeData: FormData): Observable<any> {

    let object: any = {};
    recipeData.forEach((value, key) => object[key] = value);
    console.log('Form Data:', object);
    
    const httpOptions = this.getHttpOptions(); 
    
    return this.http.post<any>(`${this.apiUrl}recipes/`, recipeData, httpOptions);
  }

  getCuisines(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}cuisines/`);
  }

  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}recipes/`);
  }

  getRecipesByUser(userId: number): Observable<Recipe[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Token ${localStorage.getItem('token')}`
      })
    };
    return this.http.get<Recipe[]>(`${this.apiUrl}users/${userId}/recipes/`, httpOptions);
  }

  //For recipe-detail 
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}recipes/${id}/`);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}recipes/${id}/`);
  }

  updateRecipe(recipeId: number, formData: FormData): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}recipes/${recipeId}/`, formData);
  }


  getRecipesByCuisine(cuisineId: number): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}recipes/cuisine/${cuisineId}/`);
  }

  saveRecipeForUser(userId: number, recipeId: number): Observable<any> {
    const url = `http://localhost:8000/users/${userId}/save_recipe/${recipeId}/`;
    return this.http.post(url, {});
  }

  
  getSavedRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('http://localhost:8000/users/saved_recipes/');
  }


  checkIfRecipeSaved(userId: number, recipeId: number): Observable<{ saved: boolean }> {
    return this.http.get<{ saved: boolean }>(`http://localhost:8000/users/${userId}/check_recipe_saved/${recipeId}/`);
  }
  
  unsaveRecipeForUser(userId: number, recipeId: number): Observable<any> {
    const url = `http://localhost:8000/users/${userId}/unsave_recipe/${recipeId}/`;
    return this.http.delete(url);
  }
  

  

  
}
