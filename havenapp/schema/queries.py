import graphene
from django.contrib.auth import get_user_model
from havenapp.models import Profile

from .types import UserType, ProfileType

# Query
class Query(graphene.AbstractType):
    users = graphene.List(UserType)
    me = graphene.Field(UserType)

    profiles = graphene.List(ProfileType)

    def resolve_profiles(self, info, **kwargs):
        return Profile.objects.all()

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()

    def resolve_me(self, info):
        user = info.context.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user
