
from django.urls import path
from .views import PaperListCreateView, PaperDetailView, PaperDownloadView

urlpatterns = [
    # List all papers (GET) and upload new paper (POST)
    path('papers/', PaperListCreateView.as_view(), name='paper-list-create'),
    
    # Get, update, or delete a specific paper
    path('papers/<int:pk>/', PaperDetailView.as_view(), name='paper-detail'),
    
    # Download a specific paper file
    path('papers/<int:pk>/download/', PaperDownloadView.as_view(), name='paper-download'),
]
