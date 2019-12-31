from django.db import models
from django.contrib.auth.hashers import make_password
from django.utils.timezone import now

# Create your models here.


class UserModel(models.Model):
    id = models.IntegerField(primary_key=True)
    email = models.CharField(max_length=255, unique=True)
    username = models.CharField(max_length=100)
    password_hash = models.CharField(max_length=128)
    created_at = models.DateTimeField(default=now())
    active = models.BooleanField()


    def hash_password(self, password):
        self.password_hash = make_password(password)

