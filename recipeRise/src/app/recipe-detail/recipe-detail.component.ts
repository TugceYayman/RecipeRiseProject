import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';
import { MatDialog } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  loggedInUserId: number | null = null;
  recipeId!: number; 
  recipe!: Recipe ;
  isLoading: boolean = false;
  formData = new FormData();
  errorMessage: string = '';
  selectedFile: File | null = null; 
  isEditMode = false;
  imagePreviewUrl: string | ArrayBuffer | null = null; 
  isEditable!: boolean;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
  )
  { this.formData = new FormData(); }

  ngOnInit(): void {
    this.recipeId = Number(this.route.snapshot.params['id']);
    if (!this.recipeId) {
      console.error('No valid recipe ID provided');
      return;
    }
    this.loggedInUserId = this.getLoggedInUserId();
    this.fetchRecipe();
  } 
  
  getLoggedInUserId(): number | null {
    const userId = localStorage.getItem('userId');
    return userId ? Number(userId) : null;
  }


  fetchRecipe() {
    this.isLoading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe(
      (data: Recipe) => {
        this.recipe = data;
        if (this.recipe && this.loggedInUserId === this.recipe.user) {
          this.isEditable = true; 
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching recipe:', error);
        this.isLoading = false;
      }
    );
  }
  

  canEditOrDelete(): boolean {
    return this.loggedInUserId === this.recipe?.user;
  }


  toggleEdit(state: boolean): void {
    this.isEditMode = state;
  }

  deleteRecipe(id: number | undefined) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this recipe?'
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true;
        this.recipeService.deleteRecipe(this.recipeId).subscribe(
          () => {
            this.dialog.open(UpdateDialogComponent, {
              data: { title: 'Info', message: 'Recipe successfully deleted!' },
            }).afterClosed().subscribe(() => {
              this.isLoading = false;
              this.router.navigate(['/profile-page']); 
            });
          },
          (error) => {
            console.error('Error deleting recipe:', error);
            this.isLoading = false;
          }
        );
      }
    });
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
  
  getIngredientsArray(ingredients: string): string[] {
    return ingredients.split(',').map(ingredient => ingredient.trim());
  }


  onFileSelected(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      const file = eventTarget.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const preview = document.getElementById('imagePreview') as HTMLImageElement;
        if (preview) {
          preview.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
      this.selectedFile = file;
    }
  }
  
  
  updateRecipe(): void {
    if (!this.recipe) {
      console.error('No recipe data to update');
      return;
    } 
    
    const formData = new FormData();
    Object.keys(this.recipe).forEach((key) => {
      const property = key as keyof Recipe;
      if (property !== 'id' && property !== 'image') {
        const value = this.recipe[property];
        if (value !== undefined && value !== null) {
          formData.append(property, typeof value === 'string' ? value : String(value));
        }
      }
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    
    this.isLoading = true;
    this.recipeService.updateRecipe(this.recipeId, formData).subscribe({
      next: (data) => {
        console.log('Update successful', data);
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Success', message: 'The recipe was updated successfully!' },
        });
        this.router.navigate(['/profile-page']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating recipe:', error.error);
        this.errorMessage = 'There was an error updating the recipe. Please try again later.';
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Error', message: 'Failed to update the recipe. Please try again later.' },
        });
        this.isLoading = false;
      },
    });
  }
  

  saveRecipe(recipeId: number): void {
    if (!this.authService.isLoggedIn()) {
      alert('You must be logged in to save recipes.');
      return;
    }
    const userId = this.loggedInUserId!;
    this.isLoading = true;
    this.recipeService.checkIfRecipeSaved(userId, recipeId).subscribe({
      next: (data) => {
        if (data.saved) {

          this.dialog.open(ConfirmationDialogComponent, {
            data: {
              title: 'Confirmation',
              message: 'Recipe is already saved. Do you want to unsave it?',
              showYesNoButtons: true
            },
          }).afterClosed().subscribe(result => {
            if (result) {
              this.unsaveRecipe(userId, recipeId);
            } else {
              this.isLoading = false;
            }
          });
        } else {
          this.saveRecipeForUser(userId, recipeId);
        }
      },
      error: (error) => {
        console.error('Error checking if recipe is saved:', error);
        this.isLoading = false;
      }
    });
    
  }
  
  saveRecipeForUser(userId: number, recipeId: number): void {
    this.recipeService.saveRecipeForUser(userId, recipeId).subscribe({
      next: (data) => {
        if (data && data.message === 'Recipe was already saved.') {
          this.dialog.open(UpdateDialogComponent, {
            data: { title: 'Info', message: 'Recipe was already saved!' },
          });
        } else {
          this.dialog.open(UpdateDialogComponent, {
            data: { title: 'Success', message: 'Recipe saved successfully!' },
          });
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error saving recipe:', error);
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Error', message: 'Error saving recipe!' },
        });
        this.isLoading = false;
      }
    });
  }
  
  unsaveRecipe(userId: number, recipeId: number): void {
    this.recipeService.unsaveRecipeForUser(userId, recipeId).subscribe({
      next: () => {
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Success', message: 'Recipe unsaved successfully!' },
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error unsaving recipe:', error);
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Error', message: 'Error unsaving recipe!' },
        });
        this.isLoading = false;
      }
    });
  }
  
  
  

  
  
  
}
