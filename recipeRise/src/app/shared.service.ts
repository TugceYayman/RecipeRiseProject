import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  truncateInstructions(instructions: string): string {
    const words = instructions.split(' ', 21); // Split into words
    if (words.length > 20) {
      return words.slice(0, 20).join(' ') + '...'; // Join first 20 words and add ellipsis
    }
    return instructions; // Return the full instructions if less than 20 words
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
