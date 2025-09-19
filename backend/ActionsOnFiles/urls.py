from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import PaperViewSet, PaperDownloadView, PapersSearchView

router = DefaultRouter()
router.register(r'papers', PaperViewSet, basename='paper')

urlpatterns = [
	path('', include(router.urls)),
	path('download/<int:pk>/', PaperDownloadView.as_view(), name='download'),
	path('search/', PapersSearchView.as_view(), name='papers-search'),
]
