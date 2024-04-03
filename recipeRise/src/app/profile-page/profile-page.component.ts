import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service'; // Import your RecipeService
import { Recipe } from '../models/recipe.model'; // Import your Recipe model

@Component({
  selector: 'app-profilePage',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  activeSection = 'personal-info';
  username: string = "";
  recipes: Recipe[] = []; // Add this to store the recipes

  // Inject the RecipeService in the constructor
  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    // Retrieve username and user ID from local storage
    this.username = localStorage.getItem('username') || 'User'; // Default to 'User' if not found
    const userId = localStorage.getItem('userId'); // Replace 'userId' with your actual key
    console.log('Local Storage User ID:', userId);
    // Ensure that the userId is not null
    if (userId) {
      const numericUserId = Number(userId);
      console.log('Numeric User ID:', numericUserId); // Debugging line
  
      if (!isNaN(numericUserId)) {
        this.recipeService.getRecipesByUser(numericUserId).subscribe(
          (data: Recipe[]) => {
            console.log('Fetched recipes:', data); // Debugging line
            this.recipes = data;
          },
          (error) => {
            console.error('Error fetching recipes:',numericUserId, error);
          }
        );
      } else {
        console.error('User ID is not a valid number');
      }
    } else {
      console.error('User ID not found in local storage');
    }
  }
  
  truncateInstructions(instructions: string): string {
    const words = instructions.split(' ', 21); // Split into words
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...'; // Join first 20 words and add ellipsis
    }
    return instructions; // Return the full instructions if less than 20 words
  }

  // getFullImageUrl(imagePath: string): string {
  //   return `http://localhost:8000${imagePath}`; // Replace with your actual backend base URL
  // }

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
  

  showSection(sectionId: string) {
    this.activeSection = sectionId;
  }
}