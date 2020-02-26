import uuid
from django.contrib.auth.models import User
from django.db import models
from havenapp.constants.constant import PreferenceFlags

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

    def get_group_flags(self):
        # Returns the preference flags of the group
        group_flags = []
        if self.seek_mentor:
            group_flags.append(PreferenceFlags.seek_mentor.name)
        if self.provide_mentor:
            group_flags.append(PreferenceFlags.provide_mentor.name)
        if self.seek_advice:
            group_flags.append(PreferenceFlags.seek_advice.name)
        if self.provide_advice:
            group_flags.append(PreferenceFlags.provide_advice.name)
        if self.find_friends:
            group_flags.append(PreferenceFlags.find_friends.name)
        if self.socialize:
            group_flags.append(PreferenceFlags.socialize.name)
        
        return group_flags