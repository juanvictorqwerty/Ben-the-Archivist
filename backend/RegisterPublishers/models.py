from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class CustomUser(AbstractUser):

    def create_user(self,email,username,password=None,**extra_fields):
        if not email or not username or not password:
            raise ValueError('A required field is missing')

        email = self.normalize_email(email.strip())
        username = username.strip()

        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    email=models.EmailField(max_length=255,unique=True)
    REQUIRED_FIELDS=[]