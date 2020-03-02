from django.db import models
from django.contrib.postgres.fields import JSONField
from django.contrib.auth.models import User
from .group import Group

class MatchHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    preferences = JSONField()
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
