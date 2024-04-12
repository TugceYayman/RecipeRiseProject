
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../search.service';
import { Recipe } from '../models/recipe.model';
import { SharedService } from '../shared.service';
//import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  recipes: Recipe[] = [];
  isLoading = false;
  cuisine!: string;
  imagePath!: string;
  truncatedInstructions!: string;
  cuisineId!: number;
  //cuisines: Cuisine[] = [];
  selectedCuisineId: number | null = null;

  constructor(
    public sharedService: SharedService,
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  setImagePathAndInstructions(imageUrl: string, instructions: string): void {
    this.imagePath = this.sharedService.getFullImageUrl(imageUrl);
    this.truncatedInstructions = this.sharedService.truncateInstructions(instructions);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.performSearch(query);
      }
    });
  }

  performSearch(query: string): void {
    this.isLoading = true;
    this.searchService.searchRecipes(query).subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
        this.isLoading = false;
      },
      (error) => {
        console.error('Search error:', error);
        this.isLoading = false;
      }
    );
  }

}
