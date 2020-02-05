from django.db import models
from django.contrib.auth.models import User

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50)
    bio = models.TextField(null=True)
    interests = models.TextField(null=True)
    country = models.CharField(max_length=50, null=True)
    city = models.CharField(max_length=50, null=True)

