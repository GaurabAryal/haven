"""
WSGI config for haven project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/howto/deployment/wsgi/
"""

import os
import django
# from django.core.wsgi import get_wsgi_application
from django.core.asgi import get_asgi_application

from havenapp.schema.consumer import MyGraphqlWsConsumer
import channels

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'haven.settings')

application = get_asgi_application({
    'websocket': channels.routing.URLRouter([
        django.urls.path('graphql/', MyGraphqlWsConsumer),
    ])
})
