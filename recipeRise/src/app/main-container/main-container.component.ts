import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mainContainer',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.css']
})
export class MainContainerComponent {
  searchQuery: string = '';
  
  constructor(private router: Router) {}

  onSearch(): void {
    if (!this.searchQuery.trim()) return; // If empty query, do nothing

    // Navigate to the search results route with the query as a parameter
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }
}

