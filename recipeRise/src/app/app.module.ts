import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeComponent } from './recipe-list/recipe/recipe.component';
import { MainContainerComponent } from './main-container/main-container.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { FooterComponent } from './footer/footer.component';
import { LoginComponent } from './login/login.component';
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http';
import { SignupComponent } from './signup/signup.component';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import { CuisinesRecipesComponent } from './cuisines-recipes/cuisines-recipes.component';
import { SearchComponent } from './search/search.component';
import { RouterModule } from '@angular/router';
import { SavedRecipesComponent } from './saved-recipes/savedrecipes.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RecipeListComponent,
    RecipeComponent,
    MainContainerComponent,
    ProfilePageComponent,
    FooterComponent,
    LoginComponent,
    SignupComponent,
    AddRecipeComponent,
    RecipeDetailComponent,
    UpdateDialogComponent,
    CuisinesRecipesComponent,
    SearchComponent,
    SavedRecipesComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule, 
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule, 
    RouterModule,
    MatDialogModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
