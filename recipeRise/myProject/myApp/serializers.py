from rest_framework import serializers
from myApp.models import CustomUser, Recipe, Cuisine
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


class RecipeSerializer(serializers.ModelSerializer):
    # Display the CustomUser's information if needed
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    # Add a read-only field to display the cuisine name
    cuisine_name = serializers.CharField(source='cuisine.name', read_only=True)
    
    class Meta:
        model = Recipe
        fields = '__all__'
        read_only_fields = ('user',)  # Make 'user' and 'cuisine_name' read-only

    def create(self, validated_data):
        # Assign the CustomUser from the request to the recipe when creating a new recipe
        validated_data['user'] = self.context['request'].user
        # No need to manually handle the cuisine here; it will be handled by the validated_data
        return Recipe.objects.create(**validated_data)

    def update(self, instance, validated_data):
         # Standard update procedure. Loop through validated_data items and update them on the instance.
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance