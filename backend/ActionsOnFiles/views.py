import os
from django.shortcuts import get_object_or_404
from django.http import FileResponse, Http404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser

from .models import Papers
from .serializer import PaperSerializer


class PaperListCreateView(generics.ListCreateAPIView):
    """
    List all papers or create a new paper
    GET: List all papers (public)
    POST: Upload new paper (requires authentication)
    """
    queryset = Papers.objects.all()
    serializer_class = PaperSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        """
        Custom permissions based on action
        """
        if self.request.method == 'POST':  # Upload
            permission_classes = [permissions.IsAuthenticated]
        else:  # List (GET)
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        # Set the user field to the authenticated user
        serializer.save(user=self.request.user)


class PaperDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a paper
    """
    queryset = Papers.objects.all()
    serializer_class = PaperSerializer
    parser_classes = [MultiPartParser, FormParser]
    
    def get_permissions(self):
        """
        Custom permissions based on action
        """
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            # Require authentication for updates and deletes
            permission_classes = [permissions.IsAuthenticated]
        else:  # GET (retrieve)
            permission_classes = [permissions.AllowAny]
        
        return [permission() for permission in permission_classes]


class PaperDownloadView(generics.RetrieveAPIView):
    """
    Download a paper file
    """
    queryset = Papers.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def retrieve(self, request, *args, **kwargs):
        """
        Handle file download with proper error handling
        """
        try:
            paper = self.get_object()
            
            # Check if paper has a file
            if not paper.file or not paper.file.name:
                return Response(
                    {'error': 'File not found'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Check if file exists on filesystem
            if not os.path.exists(paper.file.path):
                return Response(
                    {'error': 'File does not exist on server'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Extract clean filename
            filename = os.path.basename(paper.file.name)
            
            # Return file response
            response = FileResponse(
                paper.file.open('rb'),
                as_attachment=True,
                filename=filename
            )
            
            # Set content type for better browser handling
            response['Content-Type'] = 'application/octet-stream'
            
            return response
            
        except Papers.DoesNotExist:
            return Response(
                {'error': 'Paper not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except PermissionError:
            return Response(
                {'error': 'Permission denied to access file'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        except FileNotFoundError:
            return Response(
                {'error': 'File not found on server'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {'error': f'Error downloading file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )