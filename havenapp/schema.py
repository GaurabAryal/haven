import graphene
from graphene_django import DjangoObjectType
from .models import UserModel


# Create Input Object Types
class UserInput(graphene.InputObjectType):
    id = graphene.ID()
    username = graphene.String()
    email = graphene.String()
    password = graphene.String()


class UserType(DjangoObjectType):
    class Meta:
        model = UserModel


class CreateUser(graphene.Mutation):
    class Arguments:
        input = UserInput(required=True)

    user = graphene.Field(UserType)

    @staticmethod
    def mutate(root, info, input=None):
        user_instance = UserModel(username=input.username, email=input.email, active=True)
        user_instance.save()
        return CreateUser(user=user_instance)


class Mutation(graphene.ObjectType):
    create_user = CreateUser.Field()


class Query(graphene.ObjectType):
    users = graphene.List(UserType)

    @staticmethod
    def resolve_users(self, info, **kwargs):
        return UserModel.objects.all()
