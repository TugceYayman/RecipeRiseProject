// src/app/models/recipe.model.ts
export interface Recipe {
    id?: number; // Optional because it's assigned by the backend
    user: number; // Assuming you'll store only the user ID
    title: string;
    ingredients: string;
    instructions: string;
    cuisine: number
    cuisine_name: string;
    created_at?: string; // Optional, auto-assigned by the backend
    updated_at?: string; // Optional, auto-assigned by the backend
    image?: string; 
    user_id: number;
  }
  
