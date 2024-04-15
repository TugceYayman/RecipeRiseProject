from rest_framework import serializers
from myApp.models import CustomUser, Recipe, Cuisine,SavedRecipe 
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_username(self, value):
        # Custom validation for username
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with that username already exists.")
        return value

    def validate_email(self, value):
        # Custom validation for email
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

    def update(self, instance, validated_data):
        # Update the User instance
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance

class CuisineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuisine
        fields = ('id', 'name')
        
class RecipeSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    cuisine_name = serializers.CharField(source='cuisine.name', read_only=True)
    image = serializers.ImageField(required=False, allow_null=True, use_url=True)
    
    class Meta:
        model = Recipe
        fields = ('id', 'title', 'ingredients', 'instructions', 'image', 'created_at', 'updated_at', 'user', 'cuisine', 'cuisine_name')
        read_only_fields = ('user', 'cuisine_name')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return Recipe.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.ingredients = validated_data.get('ingredients', instance.ingredients)
        instance.instructions = validated_data.get('instructions', instance.instructions)

        # Handle image separately if it is in the request
        if 'image' in self.context['request'].FILES:
            image_file = self.context['request'].FILES['image']
            instance.image.save(image_file.name, image_file, save=True)
        
        instance.save()
        return instance

class SavedRecipeSerializer(serializers.ModelSerializer):
    # Nest the RecipeSerializer to serialize the related Recipe instance.
    recipe = RecipeSerializer(read_only=True)

    class Meta:
        model = SavedRecipe
        fields = ['id', 'recipe']  # 'recipe' is the related Recipe instance

    def to_representation(self, instance):
        # Override the to_representation to customize the output.
        representation = super(SavedRecipeSerializer, self).to_representation(instance)
        recipe_representation = representation.pop('recipe')
        for key in recipe_representation:
            # This will add all fields from the recipe to the representation.
            representation[key] = recipe_representation[key]
        return representation