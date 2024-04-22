import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  truncateInstructions(instructions: string): string {
    const words = instructions.split(' ', 41); 
    if (words.length > 40) {
      return words.slice(0, 40).join(' ') + '...'; // Join first 20 words and add ellipsis
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
    return `http://localhost:8000/${imagePath}`;
  }
}
