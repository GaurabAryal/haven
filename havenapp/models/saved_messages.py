from django.db import models
from django.contrib.auth.models import User
from .chat import Chat
import uuid


class SavedMessages(models.Model):
    group_id = models.UUIDField(default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
