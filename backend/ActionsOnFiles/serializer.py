from rest_framework import serializers
from .models import Papers

class PaperSerializer(serializers.ModelSerializer):
    username=serializers.CharField(source='user.username',read_only=True)
    class Meta:
        model=Papers
        fields='__all__'
        read_only_fields=['user']

