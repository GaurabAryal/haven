import graphene

# Create Input Object Types
class UserInput(graphene.InputObjectType):
    username = graphene.String(required=True)
    email = graphene.String(required=True)
    password = graphene.String(required=True)
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)

class ProfileInput(graphene.InputObjectType):
    position = graphene.String(required=True)
    bio = graphene.String()
    interests = graphene.String()