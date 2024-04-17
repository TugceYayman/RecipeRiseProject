
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from . import views
from .views import api_signup, api_login, logout_view, RecipeListCreateView, RecipeDetailView,CuisineList, UserRecipeList, recipes_by_cuisine, save_recipe, list_saved_recipes
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('recipes/random/', views.random_recipes, name='random_recipes'),
    path('cuisines/', CuisineList.as_view(), name='cuisine-list'),
    path('register/',api_signup , name='register'),
    path('signup/', api_signup, name='signup'),
    path('login/', api_login, name='login'),
    path('logout', logout_view, name='logout'),
    path('', RedirectView.as_view(url='login/', permanent=True)),
     path('users/saved_recipes/', list_saved_recipes, name='saved-recipes'),
    path('users/<int:user_id>/save_recipe/<int:recipe_id>/', views.save_recipe, name='save_recipe'),
    path('search/', views.search, name='search'), 
    path('users/<int:user_id>/save_recipe/<int:recipe_id>/', save_recipe, name='save_recipe'),
    path('recipes/cuisine/<int:cuisine_id>/', views.recipes_by_cuisine, name='recipes_by_cuisine'),
    path('users/<int:userId>/recipes/', UserRecipeList.as_view(), name='user-recipes'),  
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

