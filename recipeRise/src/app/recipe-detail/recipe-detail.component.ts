import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../models/recipe.model';


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {

  recipeId!: number; //!(postfix : definite assignment assertion oparetor) tells ts that i am certain that the variable will be assigned before it is used
  recipe!: Recipe ;
  isLoading: boolean = false;
  formData = new FormData();
  errorMessage: string = '';
  selectedFile: File | null = null; // Make sure this is set when a file is selected
  isEditMode = false;
  imagePreviewUrl: string | ArrayBuffer | null = null; // This will hold the image preview URL

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router
  )
  { this.formData = new FormData(); }

  ngOnInit(): void {
    // Parse your route only once and ensure recipeId is a number
    this.recipeId = Number(this.route.snapshot.params['id']);
    if (!this.recipeId) {
      console.error('No valid recipe ID provided');
      return;
    }
    
    this.fetchRecipe();
  }  

  fetchRecipe() {
    this.isLoading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe(
      (data: Recipe) => {
        this.recipe = data;
        this.isLoading = false;
      },
      (error) => {
        // Handle the error
        console.error('Error fetching recipe:', error);
        this.isLoading = false;
      }
    );
  }


  toggleEdit(state: boolean): void {
    this.isEditMode = state;
  }

  deleteRecipe(id:number | undefined) {
    const confirmation = confirm('Are you sure you want to delete this recipe?');
    if (confirmation) {
      this.isLoading = true;
      this.recipeService.deleteRecipe(this.recipeId).subscribe(
        () => {
          // Deletion successful
          this.isLoading = false;
          this.router.navigate(['/recipes']); // Navigate to the list of recipes
        },
        (error) => {
          // Handle the error
          console.error('Error deleting recipe:', error);
          this.isLoading = false;
        }
      );
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


  onFileSelected(event: Event): void {
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.files && eventTarget.files[0]) {
      const file = eventTarget.files[0];
  
      // Use FileReader to preview the image, if necessary
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        // Implement preview functionality, if you have a preview element
        const preview = document.getElementById('imagePreview') as HTMLImageElement;
        if (preview) {
          preview.src = e.target?.result as string;
        }
      };
      reader.readAsDataURL(file);
  
      // Store the file object for later when submitting the form
      this.selectedFile = file;
    }
  }
  
  
  updateRecipe(): void {
    if (!this.recipe) {
      console.error('No recipe data to update');
      return;
    }
    
    // Create a new FormData object
    const formData = new FormData();
    // Append all recipe fields except the 'id' to the formData
    Object.keys(this.recipe).forEach((key) => {
      const property = key as keyof Recipe;
      const value = this.recipe[property];
      if (property !== 'id' && value !== undefined && value !== null) {
        formData.append(property, typeof value === 'string' ? value : String(value));
      }
    });
    
    // Append the image file if a new image has been selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    
      // Log the FormData contents just before the PUT request
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    
    // Set loading to true and call the updateRecipe method from your RecipeService
    this.isLoading = true;
    this.recipeService.updateRecipe(this.recipeId, formData).subscribe({
      next: (data) => {
        console.log('Update successful', data);
        this.router.navigate(['/profile-page']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error updating recipe:', error.error);
        this.errorMessage = 'There was an error updating the recipe. Please try again later.';
        this.isLoading = false;
      },
    });
  }
  
  
  
}
