import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Cuisine } from '../cuisine.model';
import { Router } from '@angular/router';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';

declare global {
  interface FormData {
    entries(): IterableIterator<[string, FormDataEntryValue]>;
  }
}


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

  constructor(private recipeService: RecipeService,
    private router: Router,
    private dialog: MatDialog,) { }

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

    console.log('Title:', this.recipeTitle); // Log the title
    console.log('Ingredients:', this.ingredients); // Log the ingredients
    console.log('Instructions:', this.instructions); // Log the instructions

    const formData = new FormData();
    formData.append('title', this.recipeTitle);
    formData.append('ingredients', this.ingredients);
    formData.append('instructions', this.instructions);
    formData.append('cuisine', this.selectedCuisine);

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }

     // Log FormData content before sending
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
      // Log the form data for debugging purposes

    this.recipeService.addRecipe(formData).subscribe({
      next: (response) => {
        this.dialog.open(UpdateDialogComponent, {
          data: { title: 'Info', message: 'Recipe successfully added!' },
        }).afterClosed().subscribe(() => {
          this.router.navigate(['/profile-page']); // Navigate to the list of recipes
        });
        // Redirect or clear form here
      },
      error: (error) => {
        console.error('There was an error!', error);
      }
    });

  }
}