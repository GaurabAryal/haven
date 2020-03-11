import uuid
from typing import List, Tuple, Union, Dict

from django.contrib.auth.models import User
from django.db.models import Count, Q
from havenapp.models import Group, Membership
from havenapp.constants.constant import PreferenceFlags, UserStatus

class UserPreferences():
    def __init__(self, user_id: str, preference_flags: List[int], city: str, country: str):
        self.user_id: str = user_id
        self.city: str = city
        self.country: str = country
        self.preference_flags: Dict[str, bool] = self.parse_preferences(preference_flags)

    def parse_preferences(self, user_pref: List[int]) -> Dict[str, bool]:
        # If no pref, toggle all flags that is not providing
        if not user_pref or (PreferenceFlags.no_preference.value in user_pref):
            return {'find_friends': True, 'socialize': True, 'seek_mentor': True, 'seek_advice': True}

        return {PreferenceFlags(p).name: True for p in user_pref}

    def build_query(self):
        q = Q()
        for p, flag in self.preference_flags.items():
            q |= Q(**{p: flag})
        return q

def find_best_match(user_preference: UserPreferences) -> str:
    # Build query and create groups
    query = user_preference.build_query()
    matching_groups = Group.objects.annotate(num_members=Count('members')) \
                        .exclude(members__id=user_preference.user_id, is_dm=False) \
                        .filter(Q(num_members__lt=5)) \
                        .filter(query)

    # group_similarity
    best_group: Union[int, None] = None
    best_similarity_score: float = 0
    for g in matching_groups:
        group_flags = g.get_group_flags()
        sim_score = 0
        try:
            sim_score = get_jaccard_sim(user_preference.preference_flags, group_flags)
        except ZeroDivisionError:
            sim_score = 0

        if best_similarity_score < sim_score:
            best_similarity_score = sim_score
            best_group = g.id

    return best_group

def get_jaccard_sim(user_preference_list: List[str], group_flags_list: List[str]) -> float: 
    user_set = set(user_preference_list) 
    group_set = set(group_flags_list)
    sim = user_set.intersection(group_set)
    return float(len(sim)) / (len(user_set) + len(group_set) - len(sim))

def join_group(user_preference: UserPreferences, group_id: uuid.UUID) -> str:
    # Get groups
    user = User.objects.get(id=user_preference.user_id)
    group = Group.objects.get(id=group_id)

    # Add user to group
    group.members.add(user)

    # If a mentor/professional joins, we don't need another one
    if PreferenceFlags.provide_mentor.name in user_preference.preference_flags:
        group.mentors += 1
        group.seek_mentor = True
        group.provide_mentor = False
     
    if PreferenceFlags.provide_advice.name in user_preference.preference_flags:
        group.professionals += 1
        group.seek_advice = True
        group.provide_advice = False

    # Hack to get proper people connected
    # If group has three people already and a mentor has not been found, find mentor for group
    if PreferenceFlags.seek_mentor.name in user_preference.preference_flags:
        group.seekers += 1

        if group.mentors < 1 and group.members.count() >= 3:
            group.seek_mentor = False
            group.provide_mentor = True
        
        else:
            group.seek_mentor = True
            if group.mentors < 1:
                group.provide_mentor = True

    
    # Same comprimize for seek_advice
    if PreferenceFlags.seek_advice.name in user_preference.preference_flags:
        group.seekers += 1

        if group.professionals < 1 and group.members.count() >= 3:
            group.seek_advice = False
            group.provide_advice = True
        
        else:
            group.seek_mentor = True
            if group.professionals < 1:
                group.provide_advice = True

    return group.id

def join_new_group(user_preference: UserPreferences) -> str:
    user = User.objects.get(id=user_preference.user_id)
    new_group = Group.objects.create(**user_preference.preference_flags)
    m = Membership(user=user, group=new_group)
    m.save()
    return new_group.id

def update_member_status(group_id: uuid.UUID):
    group = Group.objects.get(id=group_id)

    if group.members.count() >= 3:
        for u in group.members.all():
            if u.profile.status == UserStatus.SEARCHING.value:
                u.profile.status=UserStatus.NEWLY_MATCHED.value
                u.profile.save()
