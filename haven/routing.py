from channels.routing import ProtocolTypeRouter, URLRouter
from haven.urls import websocket_urlpatterns
from havenapp.websocket import consumer
import django


application = ProtocolTypeRouter({
    # (http->django views is added by default)
    'websocket': URLRouter(
        [django.urls.path("graphql/", consumer.MyGraphqlWsConsumer)]
        ),
})