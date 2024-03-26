
from django.contrib import admin
from django.urls import path, include
from django.views.generic.base import RedirectView
from . import views
from .views import api_signup, api_login, logout_view, RecipeListCreateView, RecipeDetailView
from django.contrib.auth import views as auth_views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('recipes/', RecipeListCreateView.as_view(), name='recipe-list'),
    path('recipes/<int:pk>/', RecipeDetailView.as_view(), name='recipe-detail'),
    path('register/',api_signup , name='register'),
    path('signup/', api_signup, name='signup'),
    path('login/', api_login, name='login'),
    path('logout', logout_view, name='logout'),
    path('', RedirectView.as_view(url='login/', permanent=True)),  # Redirect root to login
]


