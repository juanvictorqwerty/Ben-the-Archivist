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
            email = data.get('email').strip().tolower()
            username = data.get('username')

            user = None
            if email:
                user = authenticate(request, email=email, password=password)
            if not user and username:
                # Try username if email failed or not provided
                from django.contrib.auth import get_user_model
                User = get_user_model()
                try:
                    user_obj = User.objects.get(username=username)
                    if user_obj.check_password(password):
                        user = user_obj
                except User.DoesNotExist:
                    user = None

            if user:
                _, token = AuthToken.objects.create(user)
                return Response(
                    {
                        'user': self.serializer_class(user).data,
                        'token': token,
                        'username': user.username
                    }
                )
            else:
                return Response({'error': 'Invalid credentials'}, status=401)
        else:
            return Response(serializer.errors, status=400)
