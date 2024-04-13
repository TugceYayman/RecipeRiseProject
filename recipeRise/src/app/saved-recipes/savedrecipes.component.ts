import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';
import { SharedService } from '../shared.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-savedrecipes',
  templateUrl: './savedrecipes.component.html',
  styleUrls: ['./savedrecipes.component.css']
})
export class SavedRecipesComponent implements OnInit {
  savedRecipes: Recipe[] = [];
  isLoading = true;
  imagePath!: string;
  truncatedInstructions!: string;

  constructor(public sharedService: SharedService, private recipeService: RecipeService, private route: ActivatedRoute,) { }
  
  setImagePathAndInstructions(imageUrl: string, instructions: string): void {
    this.imagePath = this.sharedService.getFullImageUrl(imageUrl);
    this.truncatedInstructions = this.sharedService.truncateInstructions(instructions);
  }

  ngOnInit() {
    this.recipeService.getSavedRecipes().subscribe(
      (recipes) => {
        this.savedRecipes = recipes;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching saved recipes', error);
        this.isLoading = false;
      }
    );
  }
}