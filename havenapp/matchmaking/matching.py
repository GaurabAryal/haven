import operator
from functools import reduce
from typing import List, Tuple, Union, Dict

from django.contrib.auth.models import User
from django.db.models import Count, Q
from havenapp.models import Group, Membership
from havenapp.constants.constant import PreferenceFlags

class UserPreferences():
    def __init__(self, user_id: str, preference_flags: Dict[str, bool]):
        self.user_id: str = user_id
        self.preference_flags: Dict[str, bool] = UserPreferences.parse_preferences(preference_flags)

    @staticmethod
    def parse_preferences(user_pref: Dict[str, bool]):
        return {PreferenceFlags(p).name: True for p in user_pref}


def get_count_available_groups():
    available_groups = Group.objects.annotate(num_members=Count('members')).filter(Q(num_members__lt=5))
    return available_groups.count()

def build_query(preference_flags: Dict[str, bool]):
    q = Q()
    for p, flag in preference_flags.items():
        q |= Q(**{p: flag})
    return q

def find_best_match(user_preference: UserPreferences) -> str:

    print(user_preference.preference_flags)

    # If no preferences
    if not user_preference.preference_flags or PreferenceFlags.any in user_preference.preference_flags:
        group = Group.objects.annotate(num_members=Count('members')) \
                .exclude(members__id=user_preference.user_id) \
                .filter(Q(num_members__lt=5)) \
                .filter(provide_mentor=False, provide_advice=False) \
                .first()
        return group.id

    # Build query and create groups
    query = build_query(user_preference.preference_flags)
    matching_groups = Group.objects.annotate(num_members=Count('members')) \
                        .exclude(members__id=user_preference.user_id) \
                        .filter(Q(num_members__lt=5)) \
                        .filter(query)

    # group_similarity
    best_group: Union[int, None] = None
    best_similarity_score: float = 0
    for g in matching_groups:
        group_flags = g.get_group_flags()

        sim_score = get_jaccard_sim(user_preference.preference_flags, group_flags)
        
        if best_similarity_score < sim_score:
            best_similarity_score = sim_score
            best_group = g.id

    return best_group

def get_jaccard_sim(user_preference_list: List[str], group_flags_list: List[str]) -> float: 
    user_set = set(user_preference_list) 
    group_set = set(group_flags_list)
    sim = user_set.intersection(group_set)
    return float(len(sim)) / (len(user_set) + len(group_set) - len(sim))

def join_group(user_preference: UserPreferences, group_id: str) -> str:
    # Get groups
    user = User.objects.get(id=user_preference.user_id)
    group = Group.objects.get(id=group_id)
    print(user)

    # Add user to group
    group.members.add(user)

    # If a mentor/professional joins, we don't need another one
    if PreferenceFlags.provide_mentor.name in user_preference.preference_flags:
        group.providers += 1
        group.seek_mentor = True
        group.provide_mentor = False
     
    if PreferenceFlags.provide_advice.name in user_preference.preference_flags:
        group.providers += 1
        group.seek_advice = True
        group.provide_advice = False

    # Hack to get proper people connected
    # If group has three people already and a mentor has not been found, find mentor for group
    if PreferenceFlags.seek_mentor.name in user_preference.preference_flags:
        group.seekers += 1

        if group.provide_mentor and group.members.count() >= 3:
            group.seek_mentor = False
            group.provide_mentor = True
    
    # Same comprimize for seek_advice
    if PreferenceFlags.seek_advice.name in user_preference.preference_flags:
        group.seekers += 1

        if group.provide_advice and group.members.count() >= 3:
            group.seek_advice = False
            group.provide_advice = True

    return group.id

def join_new_group(user_preference: UserPreferences) -> str:
    user = User.objects.get(id=user_preference.user_id)
    new_group = Group.objects.create(**user_preference.preference_flags)
    m = Membership(user=user, group=new_group)
    m.save()
    return new_group.id

