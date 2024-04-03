import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'recipe-list', component: RecipeListComponent },
  { path: 'profile-page', component: ProfilePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'add-recipe', component: AddRecipeComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
