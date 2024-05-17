import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { SharedService } from '../shared.service';


@Component({
  selector: 'recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: any[] = [];
  imagePath!: string;
  truncatedInstructions!: string;

  constructor(private recipeService: RecipeService,
    public sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.fetchRandomRecipes();
  }

  fetchRandomRecipes(): void {
    this.recipeService.getRandomRecipes().subscribe(
      (data) => {
        console.log(data); 
        this.recipes = data;
        if (this.recipes.length > 0 && this.recipes[0].cuisineType) {
          console.log('Cuisine Type exists', this.recipes[0].cuisineType);
        } else {
          console.log('Cuisine Type is missing');
        }
      },
      (error) => {
        console.error('Error fetching random recipes', error);
      }
    );
  }
  

  getFullImageUrl(imagePath?: string): string {
    if (!imagePath) {
      return 'path_to_default_image.png'; 
    }
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `http://localhost:8000/media/${imagePath}`;
  }

  truncateInstructions(instructions: string): string {
    const words = instructions.split(' ', 41); 
    if (words.length > 40) {
      return words.slice(0, 40).join(' ') + '...'; 
    }
    return instructions; 
  }


  cuisineNames: { [key: number]: string } = {
    1: 'Mexican',
    2: 'Italian',
    3: 'Chinese',
    4: 'Indian',
    5: 'Japanese',
    6: 'Turkish',
    7: 'American',
  };

  getCuisineNameById(id: number): string {
    return this.cuisineNames[id] || 'Cuisine not found';
  }

 
}

