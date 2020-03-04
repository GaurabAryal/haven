import uuid
from django.contrib.auth.models import User
from .group import Group
from django.db import models

class Chat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    react = models.IntegerField(default=0)
    chat_time = models.DateTimeField(auto_now_add=True)


