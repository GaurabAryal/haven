import pytest
from django.contrib.auth.models import User
from havenapp.fixtures.factory import UserFactory, ProfileFactory

@pytest.mark.django_db
def test_user_create():
    u = UserFactory()
    assert User.objects.count() == 1

@pytest.mark.django_db
def test_profile_create():
    user1 = UserFactory(profile=None)
    print(user1)
    p = ProfileFactory(
        user=user1,
        bio="test",
        interests="test",
        status=1
    )
    print(p)
    assert user1.profile.bio == "test"
    assert user1.profile.status == 1