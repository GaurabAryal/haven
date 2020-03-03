export const AUTH_TOKEN = 'auth-token';
export const UPLOAD_URL =
  'https://api.cloudinary.com/v1_1/dix3wp2wae/upload';
export const UPLOAD_PRESET = 'ywgbrqps';
export const UPLOAD_API_KEY = '643182473321327';
export const MIN_GROUP_SIZE = 3;
export const OPTIONS = {
  position: {
    RELATIVE: 'relative',
    PROFESSIONAL: 'professional',
    FRIEND: 'friend',
    OTHER: 'other',
    UNKNOWN: 'unknown',
  },
  preferences: {
    ALL: 'all',
    FRIENDS: 'friends',
    SOCIALIZING: 'socializing',
    MENTEE: 'mentee',
    MENTOR: 'mentor',
    SEEK_PROF: 'seekProfessional',
    GIVE_PROF: 'giveProfessional',
  },
  isLocationPreferred: {
    YES: 'yes',
    NO: 'no',
  },
};
export const QUESTION_OPTIONS = {
  position: {
    [OPTIONS.position.RELATIVE]: 'Relative of person with dementia',
    [OPTIONS.position.PROFESSIONAL]: 'Professional caregiver',
    [OPTIONS.position.FRIEND]: 'Friend of person with dementia',
    [OPTIONS.position.OTHER]: 'Other',
    [OPTIONS.position.UNKNOWN]: 'Prefer not to say',
  },
  preferences: {
    [OPTIONS.preferences.ALL]: 'Any',
    [OPTIONS.preferences.FRIENDS]: 'Make new friends',
    [OPTIONS.preferences.SOCIALIZING]: 'General socializing',
    [OPTIONS.preferences.MENTEE]: 'Seeking mentorship',
    [OPTIONS.preferences.MENTOR]: 'Provide mentorship',
    [OPTIONS.preferences.SEEK_PROF]: 'Seeking professional advice',
    [OPTIONS.preferences.GIVE_PROF]: 'Giving professional advice',
  },
  isLocationPreferred: {
    [OPTIONS.isLocationPreferred.YES]: 'Yes',
    [OPTIONS.isLocationPreferred.NO]: 'No preference',
  },
};
export const PREFERENCE_MAPPING = {
  [OPTIONS.preferences.ALL]: 0,
  [OPTIONS.preferences.FRIENDS]: 1,
  [OPTIONS.preferences.SOCIALIZING]: 2,
  [OPTIONS.preferences.MENTEE]: 3,
  [OPTIONS.preferences.MENTOR]: 4,
  [OPTIONS.preferences.SEEK_PROF]: 5,
  [OPTIONS.preferences.GIVE_PROF]: 6,
};
