import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service'; 
import { Recipe } from '../models/recipe.model'; 
import { AuthService } from '../auth.service'; 
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { UserService } from '../user.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-profilePage',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  activeSection = 'personal-info';
  username: string = "";
  recipes: Recipe[] = []; 
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  selectedProfilePic!: File;
  profilePicturePath: any;

  constructor(private userService: UserService, private recipeService: RecipeService, private authService: AuthService, public dialog: MatDialog,
  private router: Router
  ) { }
  
  openFileSelector(): void {
    document.getElementById('profilePictureInput')?.click();
  }
  
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const userId = localStorage.getItem('userId'); 
      if (userId) {
        const key = `profilePicture_${userId}`;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const image = document.getElementById('selectedProfilePic') as HTMLImageElement;
          image.src = e.target.result;  
          localStorage.setItem(key, e.target.result);
        };
        reader.readAsDataURL(file);   
        this.selectedProfilePic = file;
        this.saveProfilePicture();
      } else {
        console.error('User ID not found in local storage');
      }
    }
  }
    
  saveProfilePicture(): void {
    const loggedInUserId = this.authService.getLoggedInUserId();
    if (this.selectedProfilePic && loggedInUserId) {
      this.userService.updateProfilePicture(loggedInUserId, this.selectedProfilePic)
      .subscribe({
        next: (response) => {
          console.log('Update successful:', response);
          this.openUpdateDialog(true, "Profile picture updated successfully.");
        },
        error: (error) => {
          console.error('Update failed:', error);
          this.openUpdateDialog(false, "Error updating profile picture.");
        }
      });
    }
  }
  

  selectProfilePicture(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.profilePicturePath = e.target.result;
      reader.readAsDataURL(file);
      this.selectedProfilePic = file;
    }
  }
  



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
        this.openUpdateDialog(false, "New password cannot be the same as your current password.");
      } else {
        this.authService.changePassword(currentPassword, newPassword).subscribe({
          next: (response) => {
            this.openUpdateDialog(true, "Password changed successfully.");
          },
          error: (error) => {
            this.openUpdateDialog(false, error.error.detail || "Error changing password.");
          }
        });
      }
    } else {
      this.openUpdateDialog(false, "The new passwords do not match.");
    }
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }


  confirmAccountDeletion(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete this account?'
    };
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
            this.deleteAccount();
        }
    });
}

deleteAccount(): void {
    const userId = this.authService.getLoggedInUserId(); 
    if (userId) {
        this.userService.deleteUser(userId).subscribe({
            next: (resp) => {
                this.openUpdateDialog(true, "Account deleted successfully.");
                localStorage.removeItem('token');  
                localStorage.removeItem('userId'); 
                this.router.navigate(['/login']); 
            },
            error: (error) => {
                console.error('Failed to delete account', error); }
        });
    }}
  
  ngOnInit() {

    this.username = localStorage.getItem('username') || 'User'; 
    const userId = localStorage.getItem('userId'); 
    console.log('Local Storage User ID:', userId);
    if (userId) {
      const numericUserId = Number(userId);
      console.log('Numeric User ID:', numericUserId); 
  
      if (!isNaN(numericUserId)) {
        this.recipeService.getRecipesByUser(numericUserId).subscribe(
          (data: Recipe[]) => {
            console.log('Fetched recipes:', data); 
            this.recipes = data;
          },
          (error) => {
            console.error('Error fetching recipes:', numericUserId, error);
          }
        );
  
        const key = `profilePicture_${userId}`;
        const savedProfilePicture = localStorage.getItem(key);
        if (savedProfilePicture) {
          const image = document.getElementById('selectedProfilePic') as HTMLImageElement;
          image.src = savedProfilePicture;
        }
      } else {
        console.error('User ID is not a valid number');
      }
    } else {
      console.error('User ID not found in local storage');
    }
    this.activeSection = 'public-profile'
  }
  
  
  truncateInstructions(instructions: string): string {
    const words = instructions.split(' ', 41); 
    if (words.length > 40) {
      return words.slice(0, 40).join(' ') + '...'; 
    }
    return instructions; 
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
  

  showSection(sectionId: string) {
    this.activeSection = sectionId;
  }
}
