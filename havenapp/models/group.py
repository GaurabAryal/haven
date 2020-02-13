import uuid
from django.contrib.auth.models import User
from django.db import models

class Group(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    providers = models.IntegerField(default=0)
    seekers = models.IntegerField(default=0)
    seek_mentor = models.BooleanField(default=False)
    provide_mentor = models.BooleanField(default=False)
    seek_advice = models.BooleanField(default=False)
    provide_advice = models.BooleanField(default=False)
    find_friends = models.BooleanField(default=False)
    socialize = models.BooleanField(default=False)
    members = models.ManyToManyField(User, through='Membership')
