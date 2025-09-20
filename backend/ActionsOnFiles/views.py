import os
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from django.http import FileResponse, Http404
from rest_framework import generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from .models import Papers
from .serializer import PaperSerializer


class PaperViewSet(viewsets.ModelViewSet):
    """
    List, create, retrieve, update, and delete papers
    """
    queryset = Papers.objects.all()
    serializer_class = PaperSerializer
    parser_classes = [MultiPartParser, FormParser]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.AllowAny]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


    # Remove PaperDetailView, all detail actions handled by PaperViewSet


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
        except Exception as e:
            return Response(
                {'error': f'Error downloading file: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class PapersSearchView(APIView):
	def get(self, request):
		query = request.GET.get('q', '')
		if query:
			results = Papers.objects.filter(
				Q(title__icontains=query) | Q(file__icontains=query)
			)
		else:
			results = Papers.objects.none()
		serializer = PaperSerializer(results, many=True)
		return Response(serializer.data, status=status.HTTP_200_OK)
