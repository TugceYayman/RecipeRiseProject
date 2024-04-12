import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';
  
  constructor(private authService: AuthService, private router: Router) { }
  

  logout() {
    this.authService.logout();
    // Since the authService.logout() doesn't handle  navigation, do it here
    this.router.navigate(['/login']); // Adjust the route as needed
  }
  
  onSearch(): void {
    if (!this.searchQuery.trim()) return; // If empty query, do nothing

    // Navigate to the search results route with the query as a parameter
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }


}
