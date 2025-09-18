from rest_framework import serializers
from .models import Papers

class PaperSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Papers
        fields = ['id', 'title', 'teacher', 'exam_semester', 'exam_year', 'file', 'username']
        read_only_fields = ['username']

