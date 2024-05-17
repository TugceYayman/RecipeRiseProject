
export interface Recipe {
    id?: number; 
    user: number; 
    title: string;
    ingredients: string;
    instructions: string;
    cuisine: number
    cuisine_name: string;
    created_at?: string; 
    updated_at?: string; 
    image?: string; 
    user_id: number;
  }
  
