from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import CustomUser  
from .serializers import CustomUserSerializer
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework import status
from django.contrib.auth import logout
from rest_framework.exceptions import ValidationError
from rest_framework import generics, permissions
from .models import Recipe, Cuisine, SavedRecipe
from .serializers import RecipeSerializer, CuisineSerializer, SavedRecipeSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import check_password, make_password
from django.http import JsonResponse
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
import random
from django.db.models import Max
from django.shortcuts import get_object_or_404



@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile_picture(request, user_id):
    user = get_object_or_404(CustomUser, pk=user_id)
    return Response({ 'message': 'Profile picture updated successfully.' })


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_user(request, user_id):
    if request.user.id == user_id:
        user = get_object_or_404(CustomUser, pk=user_id)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_403_FORBIDDEN)

def check_recipe_saved(request, user_id, recipe_id):
    try:
        saved_recipe = SavedRecipe.objects.get(user_id=user_id, recipe_id=recipe_id)
        return JsonResponse({'saved': True})
    except SavedRecipe.DoesNotExist:
        return JsonResponse({'saved': False})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def unsave_recipe(request, user_id, recipe_id):
    try:
        saved_recipe = SavedRecipe.objects.get(user=request.user, recipe_id=recipe_id)
        saved_recipe.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    except SavedRecipe.DoesNotExist:
        return Response({'message': 'Saved recipe not found.'}, status=status.HTTP_404_NOT_FOUND)



def random_recipes(request):
    max_id = Recipe.objects.aggregate(max_id=Max("id"))['max_id']
    random_ids = set()
    
    while len(random_ids) < 10:
        pk = random.randint(1, max_id)
        if Recipe.objects.filter(pk=pk).exists():
            random_ids.add(pk)

    random_recipes = Recipe.objects.filter(id__in=random_ids)
    data = list(random_recipes.values())
    return JsonResponse(data, safe=False)

@api_view(['POST'])
def api_signup(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        hashed_password = make_password(password)

        user = CustomUser(username=username, email=email)
        user.password = hashed_password

        serializer = CustomUserSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Account successfully created', 'user': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError as e:
        if 'UNIQUE constraint' in str(e):
            return Response({'error': 'A user with that username or email already exists.'}, status=status.HTTP_409_CONFLICT)
        else:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
    except ValidationError as e:
        return Response({'error': e.detail}, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        print(e)
        return Response({'error': 'An internal error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
@csrf_exempt
@api_view(['POST', 'GET'])
def api_login(request):
    if request.method == 'GET':
        return Response({'message': 'This endpoint requires a POST request for login.'}, status=405)

    elif request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            return Response({'error': 'Both username and password are required.'}, status=400)
        User = get_user_model()
        user = None
        if '@' in username:
            try:
                email_user = User.objects.get(email=username)
                user = authenticate(username=email_user.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userID': user.id}, status=200)
        else:
            return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def logout_view(request):
    try:
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error during logout: {str(e)}")
        return Response({'error': 'An error occurred during logout.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        
class CuisineList(generics.ListAPIView):
    queryset = Cuisine.objects.all()
    serializer_class = CuisineSerializer

class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        print(serializer.is_valid())  
        print(serializer.errors)      
        if serializer.is_valid():
            serializer.save(user=self.request.user)

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        """
        Optionally restricts the returned recipes to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = super().get_queryset()
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(user__username=username)
        return queryset

    def perform_create(self, serializer):
        print(self.request.data)
        super().perform_create(serializer)


    def perform_update(self, serializer):
        if serializer.instance.user != self.request.user:
            raise permissions.PermissionDenied("You do not have permission to edit this recipe.")
        
        image = self.request.FILES.get('image')
        if image:
            serializer.instance.image.save(image.name, image, save=False)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        
    


class UserRecipeList(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        user_id = self.kwargs['userId']
        return Recipe.objects.filter(user_id=user_id)


@api_view(['PUT'])
def change_password(request):
    user = request.user
    current_password = request.data.get('current_password')
    new_password = request.data.get('new_password')

    if user and user.check_password(current_password):
        user.password = make_password(new_password)
        user.save()
        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Wrong current password'}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def recipes_by_cuisine(request, cuisine_id):
    try:
        recipes = Recipe.objects.filter(cuisine_id=cuisine_id)
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)
    except Recipe.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


def search(request):
    query = request.GET.get('q')
    if query:
        recipes = Recipe.objects.filter(
            Q(title__icontains=query) |
            Q(cuisine__name__icontains=query) |
            Q(ingredients__icontains=query)
        )
        serializer = RecipeSerializer(recipes, many=True)
        return JsonResponse(serializer.data, safe=False)
    else:
        recipes = Recipe.objects.all() 
        serializer = RecipeSerializer(recipes, many=True)
        return JsonResponse(serializer.data, safe=False)




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_recipe(request, user_id, recipe_id):
    if request.method == 'POST':
        try:
            recipe = Recipe.objects.get(pk=recipe_id)
            saved_recipe, created = SavedRecipe.objects.get_or_create(
                user=request.user, 
                recipe=recipe
            )
            
            if created:
                serializer = SavedRecipeSerializer(saved_recipe)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {'message': 'Recipe was already saved.'}, 
                    status=status.HTTP_200_OK
                )
        except Recipe.DoesNotExist:
            return Response(
                {'message': 'Recipe does not exist.'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        return Response(
            {'message': 'Invalid request method.'}, 
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_saved_recipes(request):
    saved_recipes = SavedRecipe.objects.filter(user=request.user)
    serializer = SavedRecipeSerializer(saved_recipes, many=True)
    return Response(serializer.data)