import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service'; // Import your RecipeService
import { Recipe } from '../models/recipe.model'; // Import your Recipe model
import { AuthService } from '../auth.service'; 
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';

@Component({
  selector: 'app-profilePage',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  activeSection = 'personal-info';
  username: string = "";
  recipes: Recipe[] = []; // Add this to store the recipes
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;

  // Inject the RecipeService in the constructor
  constructor(private recipeService: RecipeService, private authService: AuthService, public dialog: MatDialog) { }



  openUpdateDialog(success: boolean, message: string): void {
    const dialogTitle = success ? 'Success' : 'Error';
    this.dialog.open(UpdateDialogComponent, {
      width: '350px',
      data: { title: dialogTitle, message: message }
    });
  }
  

  changePassword(currentPassword: string, newPassword: string, confirmPassword: string): void {
    if (newPassword === confirmPassword) {
      if (currentPassword === newPassword) {
        // If the current password and new password are the same
        this.openUpdateDialog(false, "New password cannot be the same as your current password.");
      } else {
        // Proceed to call the service to change the password
        this.authService.changePassword(currentPassword, newPassword).subscribe({
          next: (response) => {
            // Handle the successful response here
            this.openUpdateDialog(true, "Password changed successfully.");
          },
          error: (error) => {
            // Handle the error here
            this.openUpdateDialog(false, error.error.detail || "Error changing password.");
          }
        });
      }
    } else {
      // If new password and confirm password don't match
      this.openUpdateDialog(false, "The new passwords do not match.");
    }
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }
  
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
    const words = instructions.split(' ', 41); // Split into words
    if (words.length > 40) {
      return words.slice(0, 40).join(' ') + '...'; // Join first 20 words and add ellipsis
    }
    return instructions; // Return the full instructions if less than 20 words
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
  

  showSection(sectionId: string) {
    this.activeSection = sectionId;
  }
}
