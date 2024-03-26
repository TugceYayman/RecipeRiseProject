import { Component } from '@angular/core';

@Component({
  selector: 'app-profilePage',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent {

  activeSection = 'personal-info';

  constructor() {
    
   }


  showSection(sectionId: string) {
    this.activeSection = sectionId;
  }
}
