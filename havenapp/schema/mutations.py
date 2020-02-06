import graphene
from graphql import GraphQLError
from django.contrib.auth import get_user_model

from .inputs import UserInput, ProfileInput
from .types import UserNode, ProfileNode
from havenapp.models import Profile

# Mutation class to register user
class Register(graphene.Mutation):
    class Arguments:
        user_input = UserInput(required=True)

    user = graphene.Field(UserNode)

    def mutate(self, info, user_input=None):
        user = get_user_model()(
            email=user_input.email,
            username=user_input.email,
            first_name=user_input.first_name,
            last_name=user_input.last_name,
        )
        user.set_password(user_input.password)
        user.save()

        return Register(user=user)

# Mutation to create User Profile
class CreateProfile(graphene.Mutation):
    class Arguments:
        profile_input = ProfileInput(required=True)
    
    profile = graphene.Field(ProfileNode)

    def mutate(self, info, profile_input=None):
        # Check if user is logged in
        curr_user = info.context.user
        if curr_user.is_anonymous:
            raise GraphQLError('User must be logged in!')

        profile = Profile.objects.filter(user=curr_user)

        # Check if profile exists
        if profile.exists():
            profile = Profile.objects.get(user=curr_user)
            profile.position=profile_input.position
            profile.bio = profile_input.bio
            profile.interests = profile_input.interests
            profile.country = profile_input.country
            profile.city = profile_input.city
            profile.save()

        else:
            # Create profile object
            profile = Profile(
                position=profile_input.position,
                bio=profile_input.bio,
                interests=profile_input.interests,
                country=profile_input.country,
                city=profile_input.city,
                user=curr_user
            )
            profile.save()

        # This ensures that everything goes well
        profile.onboarding_done = True
        profile.save()

        return CreateProfile(
            profile=profile
        )

# Registers Users into Mutation
class Mutation(graphene.ObjectType):
    register = Register.Field()
    create_profile = CreateProfile.Field()
