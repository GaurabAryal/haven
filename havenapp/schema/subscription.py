import graphene
from .mysubscription import MySubscription

class Subscription(graphene.ObjectType):
    """Root GraphQL subscription."""
    my_subscription = MySubscription.Field()