import graphene
import graphene_django
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from havenapp.models import Profile, Group, Membership, MatchHistory

from .types import UserNode, ProfileNode, GroupNode, MembershipNode, chats, Message, MatchHistoryNode

# Queries related to MatchHistory
class MatchHistoryQuery(graphene.AbstractType):
    match_history = graphene.List(MatchHistoryNode, user_id=graphene.String(required=True), completed=graphene.Boolean())

    def resolve_match_history(self, info, user_id, completed=None, **kwargs):
        if completed is None:
            return MatchHistory.objects.filter(user__id=user_id)
        
        return MatchHistory.objects.filter(user__id=user_id, completed=completed)


# Queries related to Groups
class GroupQuery(graphene.AbstractType):
    all_groups = graphene.List(GroupNode)
    membership = graphene.List(GroupNode)
    group = graphene.Field(GroupNode, group_id=graphene.String(required=True))

    def resolve_all_groups(self, info, **kwargs):
        return Group.objects.all()

    def resolve_group(self, info, group_id):
        return Group.objects.get(id=group_id)

    def resolve_membership(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        return user.group_set.all()

# Queries related to Users
class UserQuery(graphene.AbstractType):
    user = graphene.Field(UserNode, user_id=graphene.String(required=True))
    me = graphene.Field(UserNode)

    profiles = graphene.List(ProfileNode)

    def resolve_profiles(self, info, **kwargs):
        return Profile.objects.all()

    def resolve_user(self, info, user_id):
        return get_user_model().objects.get(pk=user_id)

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        return user

# Query
class Query(GroupQuery, UserQuery, MatchHistoryQuery, graphene.ObjectType):
    history = graphene.List(Message, chatroom=graphene.String())

    def resolve_history(self, info, chatroom):
        """Return chat history."""
        del info
        return chats[chatroom] if chatroom in chats else []

