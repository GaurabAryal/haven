from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from havenapp.models import Profile

# Define a UserNode
class UserNode(DjangoObjectType):
    class Meta:
        model = get_user_model()

class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile
