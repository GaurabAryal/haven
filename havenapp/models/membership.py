from django.db import models
from django.contrib.auth.models import User
from .group import Group

class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    join_date = models.DateTimeField(auto_now_add=True)
