from django.db import models
from django.contrib.auth.models import User
from haven.storage_backends import PublicMediaStorage

# Profile Model

def get_upload_to(instance, filename):
    return f'profile/{instance.user.id}/{filename}'

class Profile(models.Model):
    # Declare types of user status
    NORMAL_USER = 1
    SEARCHING = 2
    NEWLY_MATCHED = 3
    BANNED = 4
    STATUS = (
        (NORMAL_USER, 'Normal user'),
        (SEARCHING, 'Searching for group'),
        (NEWLY_MATCHED, 'Matched with new group'),
        (BANNED, 'User is banned'),   
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50)
    bio = models.TextField(null=True)
    interests = models.TextField(null=True)
    status = models.IntegerField(
        choices=STATUS,
        default=SEARCHING, 
    )
    is_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(upload_to=get_upload_to, null=True)
    