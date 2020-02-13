from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from havenapp.models import Profile, Group, Membership

# Define a UserNode
class UserNode(DjangoObjectType):
    class Meta:
        model = get_user_model()

class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile

class GroupNode(DjangoObjectType):
    class Meta:
        model = Group

class MembershipNode(DjangoObjectType):
    class Meta:
        model = Membership
        fields = ('group', 'user')
