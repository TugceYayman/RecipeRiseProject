
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';
import { SharedService } from '../shared.service';
import { CuisineService } from '../cuisine.service';
import { switchMap } from 'rxjs/operators';


interface Cuisine {
  id: number;
  name: string;
}

@Component({
  selector: 'app-cuisines-recipes',
  templateUrl: './cuisines-recipes.component.html',
  styleUrls: ['./cuisines-recipes.component.css']
})
export class CuisinesRecipesComponent implements OnInit {

  cuisine!: string;
  imagePath!: string;
  truncatedInstructions!: string;
  cuisineId!: number;
  cuisines: Cuisine[] = [];
  selectedCuisineId: number | null = null;
  recipes: Recipe[] = [];

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    public sharedService: SharedService,
    private cuisineService: CuisineService
  ) { }
  
  loadCuisinesFromService() {
    this.cuisineService.loadCuisines().subscribe(
      (cuisines: Cuisine[]) => {
        console.log('Loaded cuisines:', cuisines); // Log to check loaded cuisines
        this.cuisines = cuisines;
      },
      error => {
        console.error('Error loading cuisines:', error);
      }
    );
  }
  

  ngOnInit() {
    this.route.params.pipe(
      // Extract the cuisine name from the route params
      switchMap(params => {
        const cuisineName = params['cuisine'];
        // Load cuisines from the backend
        return this.cuisineService.loadCuisines().pipe(
          // Once cuisines are loaded, map to the fetched cuisines
          switchMap(cuisines => {
            // Now find the ID based on the name
            const cuisineId = this.cuisineService.getCuisineIdByName(cuisineName);
            if (cuisineId != null) {
              // Fetch the recipes if the ID is valid
              return this.recipeService.getRecipesByCuisine(cuisineId);
            } else {
              throw new Error('Invalid cuisine name');
            }
          })
        );
      })
    ).subscribe(
      recipes => {
        // If everything went fine, 'recipes' will have the fetched recipes
        this.recipes = recipes;
      },
      error => {
        // If there was an error, log it
        console.error('Error fetching recipes:', error);
      }
    );
  }
  


getCuisineIdByName(cuisineName: string): number | null {
  const cuisine = this.cuisines.find(c => c.name.toLowerCase() === cuisineName.toLowerCase());
  return cuisine ? cuisine.id : null;
}


  fetchRecipesByCuisine(cuisineId: number) {
    this.recipeService.getRecipesByCuisine(cuisineId).subscribe(
      (recipes: Recipe[]) => {
        this.recipes = recipes;
      },
      error => {
        console.error('Error fetching recipes by cuisine:', error);
      }
    );
  }



  onCuisineSelected(cuisineId: number): void {
    this.selectedCuisineId = cuisineId;
    console.log('Selected cuisine ID:', cuisineId);
    this.fetchRecipesByCuisine(cuisineId);
  }

  setImagePathAndInstructions(imageUrl: string, instructions: string): void {
    this.imagePath = this.sharedService.getFullImageUrl(imageUrl);
    this.truncatedInstructions = this.sharedService.truncateInstructions(instructions);
  }
}
