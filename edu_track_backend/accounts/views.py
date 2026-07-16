from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .serializers import RegisterSerializer


@api_view(['POST'])
def register(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    user = authenticate(
        username=request.data.get("username"),
        password=request.data.get("password")
    )

    if user:
        return Response({"message": "Login successful"})

    return Response({"error": "Invalid username or password"}, status=400)


@api_view(['POST'])
def logout(request):
    return Response({"message": "Logged out successfully"})