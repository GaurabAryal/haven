import graphene
import graphql_jwt
import asgiref
import channels
from graphql import GraphQLError
from django.contrib.auth import get_user_model

from .inputs import UserInput, ProfileInput
from .types import UserNode, ProfileNode
from .subscriptions import OnNewChatMessage
from .types import chats
from havenapp.models import Profile, Group, Membership


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

        # Temp create group
        temp_group = Group.objects.create()
        temp_group.save()
        temp_member = Membership(user=curr_user, group=temp_group)
        temp_member.save()
        # REMOVE LATER

        print(temp_group)
        print(temp_member)

        return CreateProfile(
            profile=profile
        )


class SendChatMessage(graphene.Mutation, name="SendChatMessagePayload"):
    """Send chat message."""

    ok = graphene.Boolean()

    class Arguments:
        """Mutation arguments."""

        chatroom = graphene.String()
        text = graphene.String()
        author = graphene.String()

    def mutate(self, info, chatroom, text, author):
        """Mutation "resolver" - store and broadcast a message."""
        # Use the username from the connection scope if authorized.
        username = author
        # Store a message.
        chats[chatroom].append({"chatroom": chatroom, "text": text, "author": username})
        # Notify subscribers.
        OnNewChatMessage.new_chat_message(chatroom=chatroom, text=text, author=username)

        return SendChatMessage(ok=True)


class ObtainJSONWebToken(graphql_jwt.JSONWebTokenMutation):
    user = graphene.Field(UserNode)

    @classmethod
    def resolve(cls, root, info, **kwargs):

        # Use Channels to login, in other words to put proper data to
        # the session stored in the scope. The `info.context` is
        # practically just a wrapper around Channel `self.scope`, but
        # the `login` method requires dict, so use `_asdict`.
        # asgiref.sync.async_to_sync(channels.auth.login)(info.context._asdict(), info.context.user)
        # Save the session, `channels.auth.login` does not do this.
        # info.context.session.save()

        return cls(user=info.context.user)

# Registers Users into Mutation
class Mutation(graphene.ObjectType):
    register = Register.Field()
    create_profile = CreateProfile.Field()
    login = ObtainJSONWebToken.Field()
    sendChatMessage = SendChatMessage.Field()
