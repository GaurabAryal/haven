from django.db import models
from django.contrib.auth.models import User

# Profile Model
class Profile(models.Model):
    # Declare types of user status
    NORMAL_USER = 1
    SEARCHING = 2
    NEWLY_MATCHED = 3
    STATUS = (
        (NORMAL_USER, 'Normal user'),
        (SEARCHING, 'Searching for group'),
        (NEWLY_MATCHED, 'Matched with new group'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    position = models.CharField(max_length=50)
    bio = models.TextField(null=True)
    interests = models.TextField(null=True)
    country = models.CharField(max_length=50, null=True)
    city = models.CharField(max_length=50, null=True)
    status = models.IntegerField(
        choices=STATUS,
        default=SEARCHING, 
    )
