from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CustomUser  
from .serializers import CustomUserSerializer
from django.contrib.auth.hashers import make_password
from django.db import IntegrityError
from rest_framework import status
from django.contrib.auth import logout
from rest_framework.exceptions import ValidationError
from rest_framework import generics, permissions
from .models import Recipe, Cuisine
from .serializers import RecipeSerializer, CuisineSerializer
from rest_framework.authtoken.models import Token
from django.contrib.auth import get_user_model
from django.views.decorators.csrf import csrf_exempt
from rest_framework.generics import ListAPIView



@api_view(['POST'])
def api_signup(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        hashed_password = make_password(password)

        user = CustomUser(username=username, email=email)
        user.password = hashed_password

        # Create a serializer instance with the user instance
        serializer = CustomUserSerializer(data=request.data)

        # Check if the serializer is valid
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User Account successfully created', 'user': serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except IntegrityError as e:
        # Here check the error message or code to tailor the response
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
        # Handle GET request, maybe render a login form
        return Response({'message': 'This endpoint requires a POST request for login.'}, status=405)

    elif request.method == 'POST':
        # Retrieve username and password from request data
        username = request.data.get('username')
        password = request.data.get('password')

        # Ensure both username and password are provided
        if not username or not password:
            return Response({'error': 'Both username and password are required.'}, status=400)

        # Get the User model
        User = get_user_model()

        # Initialize user to None
        user = None

        # Check if the username is an email and get the user
        if '@' in username:
            try:
                email_user = User.objects.get(email=username)
                user = authenticate(username=email_user.username, password=password)
            except User.DoesNotExist:
                pass
        else:
            user = authenticate(username=username, password=password)

        # If authentication was successful
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key, 'userID': user.id}, status=200)
        else:
            # Authentication failed
            return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST'])
def logout_view(request):
    try:
        logout(request)
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        # Log the actual error for debugging purposes
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
        print(serializer.is_valid())  # Check if serializer is valid
        print(serializer.errors)      # Print errors if any
        if serializer.is_valid():
            serializer.save(user=self.request.user)

class RecipeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

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
        # Call the superclass's method to handle the standard save logic
        super().perform_create(serializer)
        #serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.user == self.request.user:
            serializer.save()
        else:
            raise permissions.PermissionDenied("You do not have permission to edit this recipe.")

    def perform_destroy(self, instance):
        if instance.user == self.request.user:
            instance.delete()
        else:
            raise permissions.PermissionDenied("You do not have permission to delete this recipe.")
 


class UserRecipeList(ListAPIView):
    serializer_class = RecipeSerializer

    def get_queryset(self):
        # This will capture the 'user_id' from the URL and filter the recipes
        user_id = self.kwargs['userId']
        return Recipe.objects.filter(user_id=user_id)