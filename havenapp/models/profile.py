from django.db import models
from django.contrib.auth.models import User

# Profile Model
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50)
    bio = models.TextField(blank=True, null=True)
    interests = models.TextField(blank=True, null=True)
