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
    this.router.navigate(['/login']); 
  }
  
  onSearch(): void {
    if (!this.searchQuery.trim()) return; 
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery } });
  }


}
