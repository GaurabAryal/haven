import graphene
import graphene_django
from graphql import GraphQLError
from django.contrib.auth import get_user_model

from .types import UserNode, ProfileNode, GroupNode, chats, Message, MatchHistoryNode, ChatNode, is_typing, IsTyping
from havenapp.models import Profile, Group, Membership, MatchHistory, Chat, SavedMessages

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
    private_groups = graphene.List(GroupNode)

    def resolve_all_groups(self, info, **kwargs):
        return Group.objects.all()

    def resolve_group(self, info, group_id):
        return Group.objects.get(id=group_id)
    
    def resolve_private_groups(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        dm_groups = user.group_set.filter(is_dm=True).all()
        return dm_groups

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


# Queries related to Users
class ChatQuery(graphene.AbstractType):

    history = graphene.List(Message, chatroom=graphene.String())
    saved_messages = graphene.List(ChatNode, group_id=graphene.String())
    typing = graphene.List(IsTyping, group_id=graphene.String())
    recent_messages = graphene.List(ChatNode)

    def resolve_history(self, info, chatroom):
        """Return chat history."""
        del info
        return chats[chatroom] if chatroom in chats else []

    def resolve_typing(self, info, group_id):
        del info
        return is_typing[group_id] if group_id in is_typing else []

    def resolve_saved_messages(self, info, group_id):
        """Return chat history."""
        saved_msgs = SavedMessages.objects.filter(user=info.context.user, group_id=group_id).all()
        chat = []
        for x in saved_msgs:
            chat.append(x.chat)
        return chat
    
    def resolve_recent_messages(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')

        msgs = Chat.objects.filter(user=user).order_by('group__id', '-chat_time').distinct('group__id')
        return msgs

# Query
class Query(GroupQuery, UserQuery, MatchHistoryQuery, ChatQuery, graphene.ObjectType):
    pass


