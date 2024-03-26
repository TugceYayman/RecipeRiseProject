import { Component } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model'; // Adjust the path as necessary

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent {
  recipeTitle: string = '';
  ingredients: string = '';
  instructions: string = '';
  cuisines = [
    { id: 1, name:  'Mexican' },
    { id: 2, name: 'Italian' },
    { id: 3, name: 'Chinese' },
    { id: 4, name: 'Indian' },
    { id: 2, name: 'Japanese' },
    { id: 2, name: 'Turkish' },
    { id: 2, name: 'American' },
    // Add other cuisines as needed
  ];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.fetchCuisines();
  }

  fetchCuisines() {
    // Assuming your RecipeService has a method to fetch cuisines
    this.recipeService.getCuisines().subscribe((data: any[]) => {
      this.cuisines = data;
    });
  }

  submitRecipe() {
    // Assuming user ID is managed by backend session/token
    const recipeData = {
      title: this.recipeTitle,
      ingredients: this.ingredients,
      instructions: this.instructions,
      // If needed, include 'user' here, but typically the backend would infer this from the session or auth token
    };
  
    this.recipeService.addRecipe(recipeData as Recipe).subscribe({
      next: (response) => {
        console.log(response);
        alert('Recipe added successfully');
        // Redirect or clear form here
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });
  }
}