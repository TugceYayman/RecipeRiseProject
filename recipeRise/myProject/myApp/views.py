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
from .models import Recipe
from .serializers import RecipeSerializer


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
        



@api_view(['POST'])
def api_login(request):
    identifier = request.data.get('identifier')
    password = request.data.get('password')

    # Attempt to fetch the user by email or username
    user = None
    if '@' in identifier:
        user = CustomUser.objects.filter(email=identifier).first()
    else:
        user = CustomUser.objects.filter(username=identifier).first()

    if user:
        # Use authenticate to verify username and password
        user = authenticate(request, username=user.username, password=password)
        if user:
            login(request, user)
            return Response({'message': 'Login successful'}, status=200)
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


class RecipeListCreateView(generics.ListCreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
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
        serializer.save(user=self.request.user)

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
 