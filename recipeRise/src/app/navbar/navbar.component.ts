import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(private authService: AuthService, private router: Router) { }
  
  // logout() {
  //   this.authService.logout().subscribe(() => {
  //     this.router.navigate(['/login']); // Adjust the route as needed
  //   }, error => {
  //     console.error('Logout failed', error);
  //   });
  // }
  // In your component, e.g., NavbarComponent
  logout() {
    this.authService.logout();
    // Since the authService.logout() doesn't handle  navigation, do it here
    this.router.navigate(['/login']); // Adjust the route as needed
}


}
