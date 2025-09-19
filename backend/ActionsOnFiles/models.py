from django.db import models
from django.contrib.auth import get_user_model

User=get_user_model()

# Create your models here.

class Papers(models.Model):
    file = models.FileField(upload_to='papers/')
    title = models.CharField(max_length=200)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    teacher = models.CharField(max_length=100)
    exam_semester = models.CharField(max_length=50)
    exam_year = models.IntegerField()
    uploaded_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title