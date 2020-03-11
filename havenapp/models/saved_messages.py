from django.db import models
from django.contrib.auth.models import User
from .chat import Chat
import uuid


class SavedMessages(models.Model):
    group_id = models.TextField()
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    chat = models.ForeignKey(Chat, on_delete=models.PROTECT)
