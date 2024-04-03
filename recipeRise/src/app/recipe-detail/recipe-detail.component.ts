import { Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | undefined;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const recipeId = this.route.snapshot.params['id'];
    if (recipeId) {
      this.recipeService.getRecipeById(+recipeId).subscribe(data => {
        this.recipe = data;
      });
    }
  }

  getFullImageUrl(imagePath?: string): string {
    if (!imagePath) {
      // Handle the case where imagePath is undefined,
      // e.g., return a default image path or handle it however you prefer
      return 'path_to_default_image.png'; 
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:8000/media/${imagePath}`;
  }
  
  getIngredientsArray(ingredients: string): string[] {
    // Assuming ingredients are separated by commas, adjust if necessary
    return ingredients.split(',').map(ingredient => ingredient.trim());
  }

}
