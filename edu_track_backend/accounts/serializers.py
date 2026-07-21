from rest_framework import serializers
from django.contrib.auth import get_user_model
from students.models import Student

User = get_user_model()
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'fullname', 'role'] # Added email

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', ''), # Handle email
            fullname=validated_data.get('fullname', ''),
            role=validated_data.get('role', 'teacher')
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'role']

