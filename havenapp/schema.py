import graphene
from graphene_django import DjangoObjectType
# from .models import UserModel
from django.contrib.auth import get_user_model


# Create Input Object Types
class UserInput(graphene.InputObjectType):
    id = graphene.ID()
    username = graphene.String()
    email = graphene.String()
    password = graphene.String()


class UserType(DjangoObjectType):
    class Meta:
        model = get_user_model()


class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, input=None):
        user_instance = get_user_model()(username=input.username, email=input.email)
        user_instance.set_password(input.password)
        user_instance.save()
        return CreateUser(user=user_instance)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    users = graphene.List(UserType)
    curr_user = graphene.Field(UserType)

    def resolve_users(self, info, **kwargs):
        return get_user_model().objects.all()

    def resolve_curr_user(self, info):
        user = info.conext.user
        if user.is_anonymous:
            raise Exception('Not logged in!')

        return user

