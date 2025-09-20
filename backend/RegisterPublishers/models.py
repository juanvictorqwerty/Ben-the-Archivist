from django.db import models
from django.contrib.auth.models import AbstractUser
from django_rest_passwordreset.signals import reset_password_token_created
from django.dispatch import receiver
from django.urls import reverse
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
import os


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


@receiver(reset_password_token_created)
def password_reset_token_created( reset_password_token,*args,**kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user4"""
    # Use the frontend URL from environment variables
    sitelink = os.environ.get('FRONTEND_URL')
    token = '?token={}'.format(reset_password_token.key)
    full_link = f"{sitelink}/passwordReset{token}"
    print(full_link)

    subject = 'Password Reset Requested'
    message = f"Hi,\n\nYou requested a password reset. Please use the following link to reset your password:\n{full_link}\n\nIf you did not request this, please ignore this email."
    from_email = None  # Uses DEFAULT_FROM_EMAIL from settings
    recipient_list = [reset_password_token.user.email]

    try:
        from django.core.mail import send_mail
        send_mail(subject, message, from_email, recipient_list, fail_silently=False)
        print(f"Password reset email sent to {recipient_list[0]}")
    except Exception as e:
        print(f"Error sending password reset email: {e}")
