
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from . import views
from .views import api_signup, api_login, logout_view, RecipeListCreateView, RecipeDetailView,CuisineList, UserRecipeList
from django.contrib.auth import views as auth_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    #path('admin/', admin.site.urls),
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('cuisines/', CuisineList.as_view(), name='cuisine-list'),
    path('register/',api_signup , name='register'),
    path('signup/', api_signup, name='signup'),
    path('login/', api_login, name='login'),
    path('logout', logout_view, name='logout'),
    path('', RedirectView.as_view(url='login/', permanent=True)),
    path('users/<int:userId>/recipes/', UserRecipeList.as_view(), name='user-recipes'),  
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

