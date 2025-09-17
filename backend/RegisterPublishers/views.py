from django.shortcuts import render
from rest_framework import viewsets,permissions
from .serializer import *
from .models import *
from rest_framework.response import Response
from django.contrib.auth import get_user_model
User=get_user_model

class RegisterViewSet(viewsets.ViewSet):
    permission_classes=[permissions.AllowAny]
    serializer_class=RegisterSerializer

    def create(self,request):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else :
            return Response(serializer.errors,status=400)