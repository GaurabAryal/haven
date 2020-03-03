import factory, factory.django
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from havenapp.models import Profile

@factory.django.mute_signals(post_save)
class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: "user_%d@test.com" % n)
    username = factory.Sequence(lambda n: "user_%d" % n)
    password = "test"
    first_name = factory.Sequence(lambda n: "user_firstname_%d" % n)
    last_name = factory.Sequence(lambda n: "user_firstname_%d" % n)

    profile = factory.RelatedFactory('havenapp.fixtures.factory.ProfileFactory', 'user')

@factory.django.mute_signals(post_save)
class ProfileFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Profile

    bio = 'test bio'
    position = 'test'
    interests = 'test'
    status = 1

    # We pass in profile=None to prevent UserFactory from creating another profile
    # (this disables the RelatedFactory)
    user = factory.SubFactory(UserFactory, profile=None)
