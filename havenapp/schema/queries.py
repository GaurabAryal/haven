import graphene
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from havenapp.models import Profile, Group, Membership

from .types import UserNode, ProfileNode, GroupNode, MembershipNode

# Queries related to Groups
class GroupQuery(graphene.AbstractType):
    groups = graphene.List(GroupNode)
    membership = graphene.List(GroupNode)
    group_users = graphene.List(UserNode)

    def resolve_groups(self, info, **kwargs):
        return Group.objects.all()

    def resolve_membership(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')
        
        return user.group_set.all()
    
    def resolve_group_users(self, info, **kwargs):
        user = info.context.user
        if user.is_anonymous:
            raise GraphQLError('User is not logged in!')
        
        members = user.group_set.first().users.all()
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
    pass

