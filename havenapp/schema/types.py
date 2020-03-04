import graphene
from graphene_django import DjangoObjectType
from django.contrib.auth import get_user_model
from havenapp.models import Profile, Group, Membership, MatchHistory, SavedMessages, Chat

from typing import DefaultDict, List

from collections import defaultdict

# Define a UserNode
class UserNode(DjangoObjectType):
    class Meta:
        model = get_user_model()

class ProfileNode(DjangoObjectType):
    class Meta:
        model = Profile

class Message(graphene.ObjectType, default_resolver=graphene.types.resolver.dict_resolver):
    """Message GraphQL type."""
    chatroom = graphene.String()
    text = graphene.String()
    author = graphene.String()

class SavedMsgType(graphene.ObjectType):
    class Meta:
        model = SavedMessages
    """Message GraphQL type."""
    group_id = graphene.String()

chats: DefaultDict[str, List[str]] = defaultdict(list)

class GroupNode(DjangoObjectType):
    class Meta:
        model = Group

class MembershipNode(DjangoObjectType):
    class Meta:
        model = Membership
        fields = ('group', 'user')

class MatchHistoryNode(DjangoObjectType):
    class Meta:
        model = MatchHistory