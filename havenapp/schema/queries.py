import graphene
import graphene_django
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from havenapp.models import Profile, Group, Membership

from .types import UserNode, ProfileNode, GroupNode, MembershipNode, chats, Message

# Queries related to Groups
class GroupQuery(graphene.AbstractType):
    groups = graphene.List(GroupNode)
    membership = graphene.List(GroupNode)
    group_users = graphene.List(UserNode)
    group = graphene.Field(GroupNode, group_id=graphene.String())

    def resolve_groups(self, info, **kwargs):
        return Group.objects.all()

    def resolve_group(self, info, group_id):
        return Group.objects.get(id=group_id)

    def resolve_membership(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        return user.group_set.all()

    def resolve_group_users(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        members = user.group_set.first().members.all()
        return members

# Queries related to Users
class UserQuery(graphene.AbstractType):
    users = graphene.List(UserNode)
    me = graphene.Field(UserNode)

    profiles = graphene.List(ProfileNode)

    def resolve_profiles(self, info, **kwargs):
        return Profile.objects.all()

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        return user

# Query
class Query(GroupQuery, UserQuery, graphene.ObjectType):
    history = graphene.List(Message, chatroom=graphene.String())

    def resolve_history(self, info, chatroom):
        """Return chat history."""
        del info
        return chats[chatroom] if chatroom in chats else []

