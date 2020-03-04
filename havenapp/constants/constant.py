import enum

class PreferenceFlags(enum.Enum):
    no_preference = 0
    find_friends = 1
    socialize = 2
    seek_mentor = 3
    provide_mentor = 4
    seek_advice = 5
    provide_advice = 6

class UserStatus(enum.Enum):
    NORMAL_USER = 1
    SEARCHING = 2
    NEWLY_MATCHED = 3