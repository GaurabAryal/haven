"""
WSGI config for haven project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os
from channels.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'haven.settings')

application = get_default_application()

# _application = channels.routing.ProtocolTypeRouter(
#     {
#         "websocket": channels.auth.AuthMiddlewareStack(
#             channels.routing.URLRouter(
#                 [django.urls.path("graphql/", MyGraphqlWsConsumer)]
#             )
#         )
#     }
# )