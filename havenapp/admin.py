from django.contrib import admin
from .models import Profile, Membership, Group

# Register your models here.
admin.site.register(Profile)
admin.site.register(Membership)
admin.site.register(Group)