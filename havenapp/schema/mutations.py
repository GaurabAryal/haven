import graphene
import graphql_jwt
import asgiref
import channels
from graphql import GraphQLError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.db.models import Count, Q

from .inputs import UserInput, ProfileInput
from .types import UserNode, ProfileNode, GroupNode
from .subscriptions import OnNewChatMessage
from .types import chats
from havenapp.models import Profile, Group, Membership, MatchHistory
from havenapp.matchmaking.matching import UserPreferences, find_best_match, join_group, join_new_group, update_member_status
from havenapp.constants.constant import UserStatus

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
        if not profile.exists():
            # Create profile object
            profile = Profile(
                position=profile_input.position,
                bio=profile_input.bio,
                interests=profile_input.interests,
                user=curr_user
            )
            profile.save()

        # This ensures that everything goes well
        return CreateProfile(
            profile=profile
        )

class UpdateProfile(graphene.Mutation):
    class Arguments:
        profile_input = ProfileInput(required=True)
    
    profile = graphene.Field(ProfileNode)

    def mutate(self, info, profile_input=None):
        # Check if user is logged in
        curr_user = info.context.user
        if curr_user.is_anonymous:
            raise GraphQLError('User must be logged in!')

        profile = Profile.objects.filter(user=curr_user)
        if not profile.exists():
            raise GraphQLError("Error, user does not have a profile...")

        field_updates = {k:v for k, v in profile_input.items()}
        profile.update(**field_updates)

        return UpdateProfile(
            profile=profile.get()
        )

class MatchGroup(graphene.Mutation):
    class Arguments:
        user_id = graphene.String(required=True)
        preference_list = graphene.List(graphene.Int)
        country = graphene.String()
        city = graphene.String()
    
    group = graphene.Field(GroupNode)
    status = graphene.String()

    def mutate(self, info, user_id, preference_list=[], city='', country=''):
        # Randomly match user to a group, if no preference (also, should not be the last person to join group)
        # Do the matchmaking
        match_entry = None
        user = User.objects.get(id=user_id)

        # If no user exists
        if not user:
            raise GraphQLError('User does not exist')

        try:
            user_pref = UserPreferences(user_id, preference_list, city, country)
        except:
            raise GraphQLError('Please enter valid preferences')
       
        match_entry = MatchHistory.objects.create(user=user, preferences=user_pref.preference_flags, city=city, country=country)
        match_entry.save()
        
        try:             
            # Create an match history entry for successful parsing
            profile = Profile.objects.get(user=user)
            profile.status=UserStatus.SEARCHING.value
            profile.save()
        except:
            raise GraphQLError('Error updating user profile')

        # Match to Group
        group_id: str = find_best_match(user_pref)
        if not group_id:
            group_id = join_new_group(user_pref)
            status = "Joined new group"
        else:
            try:
                group_id = join_group(user_pref, group_id)
                status = "Joined existing group"
            except:
                raise GraphQLError('Error matching user with a group, please try again later')
        
        # Update Entry
        match_entry.completed = True
        match_entry.matched_group = group_id
        match_entry.save()

        # Update all users to newly matched if group have 3+ people
        update_member_status(group_id)

        g = Group.objects.get(id=group_id)
        return MatchGroup(
            group=g,
            status=status,
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
    update_profile = UpdateProfile.Field()
    login = ObtainJSONWebToken.Field()
    sendChatMessage = SendChatMessage.Field()
    match_group = MatchGroup.Field()
