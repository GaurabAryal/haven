import graphene
import graphql_jwt

import havenapp.schema.queries
import havenapp.schema.mutations
import havenapp.schema.subscription


class Query(havenapp.schema.queries.Query, graphene.ObjectType):
    pass


class Mutation(havenapp.schema.mutations.Mutation, graphene.ObjectType):
    login = graphql_jwt.ObtainJSONWebToken.Field()
    verify_token = graphql_jwt.Verify.Field()
    refresh_token = graphql_jwt.Refresh.Field()
    pass


class Subscription(havenapp.schema.subscription, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)
