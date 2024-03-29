import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model'; // Adjust the path as necessary
import { Cuisine } from '../cuisine.model';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit  {
  recipeTitle: string = '';
  ingredients: string = '';
  instructions: string = '';
  selectedCuisine: string = '';
  selectedFile: File | null = null;

  cuisines: Cuisine[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.fetchCuisines();
  }

  fetchCuisines() {
    this.recipeService.getCuisines().subscribe((data: Cuisine[]) => {
      this.cuisines = data;
    });
  }

  onFileSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = (target.files as FileList)[0];
  }

  submitRecipe() {

    const formData = new FormData();
    formData.append('title', this.recipeTitle);
    formData.append('ingredients', this.ingredients);
    formData.append('instructions', this.instructions);
    formData.append('cuisine', this.selectedCuisine);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    // Assuming user ID is managed by backend session/token
    // const recipeData = {
    //   title: this.recipeTitle,
    //   ingredients: this.ingredients,
    //   instructions: this.instructions,
    //   // If needed, include 'user' here, but typically the backend would infer this from the session or auth token
    // };
    this.recipeService.addRecipe(formData).subscribe({
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