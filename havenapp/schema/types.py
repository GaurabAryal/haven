from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from havenapp.models import Profile

# Define a UserType
class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()

class ProfileType(DjangoObjectType):
    class Meta:
        model = Profile
