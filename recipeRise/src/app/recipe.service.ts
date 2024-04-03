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

    let object: any = {};
    recipeData.forEach((value, key) => object[key] = value);
    console.log('Form Data:', object);
    
    const httpOptions = this.getHttpOptions(); // Use the headers with the token
    
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
  

  
}
