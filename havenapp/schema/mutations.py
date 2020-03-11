import graphene
import graphql_jwt
import asgiref
import channels
import os

from graphql import GraphQLError
from django.core.files.base import ContentFile
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
from django.utils.dateparse import parse_datetime
from django.db.models import Count, Q
from django.db import Error

from .inputs import UserInput, ProfileInput
from .types import UserNode, ProfileNode, GroupNode, ChatNode
from .subscriptions import OnNewChatMessage
from .types import chats
from havenapp.matchmaking.matching import UserPreferences, find_best_match, join_group, join_new_group, update_member_status
from havenapp.constants.constant import UserStatus
from havenapp.models import Profile, Group, Chat, MatchHistory, SavedMessages, Membership

from graphene_file_upload.scalars import Upload

# Mutation class to register user
class Register(graphene.Mutation):
    class Arguments:
        user_input = UserInput(required=True)

    user = graphene.Field(UserNode)
    error = graphene.String()

    def mutate(self, info, user_input=None):
        error = None
        try:
            user = get_user_model()(
                email=user_input.email,
                username=user_input.email,
                first_name=user_input.first_name,
                last_name=user_input.last_name,
            )
            user.set_password(user_input.password)
            user.save()
        except ValidationError:
            error = "An error had occurred, please try again in a few minutes"
            return Register (
                user=user,
                error=error
            )

        return Register(user=user)

# Mutation to create User Profile
class CreateProfile(graphene.Mutation):
    class Arguments:
        profile_input = ProfileInput(required=True)
        profile_picture = Upload()

    profile = graphene.Field(ProfileNode)
    error = graphene.String()

    def mutate(self, info, profile_input=None, profile_picture=None):
        # Check if user is logged in
        curr_user = info.context.user
        if curr_user.is_anonymous:
            error = "User is not logged in"
            return UpdateProfile(
                profile=None,
                error=error,
            )

        profile_query = Profile.objects.filter(user=curr_user)
        profile = None
        # Check if profile exists
        if not profile_query.exists():
            # Create profile object
            profile = Profile(
                position=profile_input.position,
                bio=profile_input.bio,
                interests=profile_input.interests,
                user=curr_user
            )

            # Check if there is am image payload
            if profile_picture:
                image_file = profile_picture
                _, image_ext = os.path.splitext(image_file.name)

                # if 'image' in image_file.content_type:
                profile.profile_picture.save(slugify(f'{curr_user.username}_profile') + image_ext, ContentFile(image_file.read()), save=False)

            profile.save()
        else:
            profile = profile_query.get()

        # This ensures that everything goes well
        return CreateProfile(
            profile=profile
        )
            

class UpdateProfile(graphene.Mutation):
    class Arguments:
        profile_input = ProfileInput(required=True)
        profile_picture = Upload()
    
    profile = graphene.Field(ProfileNode)
    error = graphene.String()

    def mutate(self, info, profile_input=None, profile_picture=None):
        error = None
        # Check if user is logged in
        curr_user = info.context.user
        if curr_user.is_anonymous:
            error = "User is not logged in" 
            return UpdateProfile(
                profile=None,
                error=error
            )

        profile_query = Profile.objects.filter(user=curr_user)
        if not profile_query.exists():
            error = "Error, user does not have a profile"
            return UpdateProfile(
                profile=None,
                error=error
            )

        try:
            field_updates = {k:v for k, v in profile_input.items()}
            profile_query.update(**field_updates)
        except:
            error = "Error updating user profile"
            return UpdateProfile(
                profile=None,
                error=error
            )

        profile = profile_query.get()
        
        try:
            # Check if there is am image payload
            if profile_picture:
                image_file = profile_picture
                _, image_ext = os.path.splitext(image_file.name)

                # if 'image' in image_file.content_type:
                profile.profile_picture.save(slugify(f'{curr_user.username}_profile') + image_ext, ContentFile(image_file.read()), save=True)
        except:
            error = "Error updating profile picture"
            return UpdateProfile(
                profile=profile,
                error=error
            )

        return UpdateProfile(
            profile=profile,
        )

class VerifyUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.String(required=True)

    profile = graphene.Field(ProfileNode)
    error = graphene.String()

    def mutate(self, info, user_id):
        user = User.objects.get(id=user_id)

        # If can't find user
        if not user:
            error = "User does not exist"
            return VerifyUser (
                profile=None,
                error=error,
            )

        profile = user.profile
        # Verify user
        try:
            profile.is_verified = True
            profile.save()
        except Error:
            error = "Error verifying user"
            return VerifyUser (
                profile=profile,
                error=error,
            )
        
        return VerifyUser (
            profile=profile
        )

class BanUser(graphene.Mutation):
    class Arguments:
        user_id = graphene.String(required=True)

    profile = graphene.Field(ProfileNode)
    error = graphene.String()

    def mutate(self, info, user_id):
        error = None
        user = User.objects.get(id=user_id)

        # If can't find user
        if not user:
            error = "User does not exist"
            return BanUser (
                profile=None,
                error=error,
            )

        profile = user.profile
        # Report user
        try:
            profile.status = UserStatus.BANNED.value
            profile.save()
        except Error:
            error = "Error banning user"
            return BanUser (
                profile=profile,
                error=error,
            )
        
        return BanUser (
            profile=profile
        )


class MatchGroup(graphene.Mutation):
    class Arguments:
        user_id = graphene.String(required=True)
        preference_list = graphene.List(graphene.Int)
        country = graphene.String()
        city = graphene.String()

    group = graphene.Field(GroupNode)
    error = graphene.String()
    status = graphene.String()

    def mutate(self, info, user_id, city='', country='', preference_list=[]):
        # Randomly match user to a group, if no preference (also, should not be the last person to join group)
        # Do the matchmaking
        match_entry = None
        user = User.objects.get(id=user_id)

        # If no user exists
        if not user:
            error = 'User does not exist'
            return MatchGroup (
                error=error
            )

        try:
            user_pref = UserPreferences(user_id, preference_list, city, country)
        except:
            error = 'Please enter valid preferences'
            return MatchGroup (
                error=error
            )
       
        match_entry = MatchHistory.objects.create(
                    user=user, 
                    preferences={
                        "preference_flags": user_pref.preference_flags, 
                        "location": {
                            "city": city,
                            "country": country,
                        },
                    },
        )
        match_entry.save()
        
        try:             
            # Create an match history entry for successful parsing
            profile = Profile.objects.get(user=user)
            profile.status=UserStatus.SEARCHING.value
            profile.save()
        except:
            error = 'Matching error, unable to update user profile'
            return MatchGroup (
                error=error
            )

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
                error = 'Error matching user with a group, please try again later'
                return MatchGroup (
                    error=error
                )
        
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


class CreatePrivateChat(graphene.Mutation):
    class Arguments:
        self_user = graphene.String(required=True)
        other_user = graphene.String(required=True)

    group = graphene.Field(GroupNode)
    error = graphene.String()

    def mutate(self, info, self_user, other_user):
        self_user = User.objects.get(id=self_user)
        other_user = User.objects.get(id=other_user)

        new_group = None
        # If can't find user
        if not self_user or not other_user:
            error = "Users does not exist"
            return CreatePrivateChat (
                group=new_group,
                error=error,
            )

        # Ensure user isn't already in a DM
        private_chat = Group.objects.filter(is_dm=True, members__id__contains=other_user.id)
        if private_chat.exists():
            error = f"User is already in a private chat with {other_user.first_name}"
            return CreatePrivateChat (
                group=private_chat.get(),
                error=error,
            )

        # Try creating DM
        try:
            new_group = Group.objects.create(is_dm=True)
            new_group.members.set([self_user, other_user])
            new_group.save()
        except Error:
            error = "Error creating a private chat"
            return CreatePrivateChat (
                group=new_group,
                error=error,
            )
        
        return CreatePrivateChat (
            group=new_group,
        )

class SendChatMessage(graphene.Mutation, name="SendChatMessagePayload"):
    """Send chat message."""

    ok = graphene.Boolean()

    class Arguments:
        """Mutation arguments."""

        chatroom = graphene.String()
        text = graphene.String()
        author = graphene.String()
        date = graphene.String()

    def mutate(self, info, chatroom, text, author, date):
        """Mutation "resolver" - store and broadcast a message."""
        # Use the username from the connection scope if authorized.
        #username is actually ID
        username = author
        user = User.objects.get(id=int(author))
        group = Group.objects.get(id=chatroom)
        # Store a message.
        chat_time = parse_datetime(date)
        save_chat = Chat(message=text, user=user, group=group, chat_time=chat_time)

        save_chat.save()

        save_chat_uuid = str(save_chat.id)
        #
        chats[chatroom].append({"chatroom": chatroom,
                                "text": text,
                                "author": username,
                                "date": date,
                                "chat_id":save_chat_uuid})
        # Notify subscribers.
        OnNewChatMessage.new_chat_message(chatroom=chatroom, text=text, author=username, date=date, chat_id=save_chat_uuid)

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


# Mutation class to save message
class SaveMessage(graphene.Mutation):
    class Arguments:

        group_id = graphene.String()
        chat_id = graphene.String()

    chat = graphene.Field(ChatNode)

    def mutate(self, info, group_id, chat_id):
        user = info.context.user
        chat = Chat.objects.get(id=chat_id)
        save_msg = SavedMessages(user=user, chat=chat, group_id=group_id)
        save_msg.save()
        return SaveMessage(chat=chat)

class SaveMessage(graphene.Mutation):
    class Arguments:

        group_id = graphene.String()
        chat_id = graphene.String()

    chat = graphene.Field(ChatNode)

    def mutate(self, info, group_id, chat_id):
        user = info.context.user
        chat = Chat.objects.get(id=chat_id)
        try:
            saved = SavedMessages.objects.get(user=user, chat=chat, group_id=group_id)
            saved.delete()
        except SavedMessages.DoesNotExist:
            save_msg = SavedMessages(user=user, chat=chat, group_id=group_id)
            save_msg.save()
        return SaveMessage(chat=chat)

# Registers Users into Mutation
class Mutation(graphene.ObjectType):
    register = Register.Field()
    create_profile = CreateProfile.Field()
    update_profile = UpdateProfile.Field()
    login = ObtainJSONWebToken.Field()
    sendChatMessage = SendChatMessage.Field()
    match_group = MatchGroup.Field()
    save_message = SaveMessage.Field()
    verify_user = VerifyUser.Field()
    ban_user = BanUser.Field()
    create_private_chat = CreatePrivateChat.Field()
