from django.shortcuts import render
from rest_framework import viewsets,permissions
from .serializer import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model,authenticate
from knox.models import AuthToken


User=get_user_model()

class RegisterViewSet(viewsets.ViewSet):
    permission_classes=[permissions.AllowAny]
    serializer_class=RegisterSerializer

    def create(self,request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Create token for the new user
            _, token = AuthToken.objects.create(user)
            return Response({
                'username': user.username,
                'token': token
            })
        else:
            return Response(serializer.errors, status=400)
        

class LoginViewset(viewsets.ViewSet):
    permission_classes=[permissions.AllowAny]
    serializer_class=LoginSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            password = data.get('password')
            # Correctly get and clean the email
            email = data.get('email', '').strip().lower()

            user = authenticate(request, email=email, password=password)

            if user:
                _, token = AuthToken.objects.create(user)
                # Use the RegisterSerializer to get user data, excluding password
                user_data = RegisterSerializer(user).data
                user_data.pop('password', None)
                return Response(
                    {
                        'user': user_data,
                        'token': token,
                        'username': user.username
                    }
                )
            else:
                return Response({'error': 'Invalid credentials'}, status=401)
        else:
            return Response(serializer.errors, status=400)
