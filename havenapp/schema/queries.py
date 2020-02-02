import graphene
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from havenapp.models import Profile

from .types import UserNode, ProfileNode

# Query
class Query(graphene.AbstractType):
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
