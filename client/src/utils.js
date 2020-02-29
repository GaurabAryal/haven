import { OPTIONS, QUESTION_OPTIONS } from 'src/constants';

export function getMemberNames(members) {
  let membersString = '';
  members.forEach((member, index) => {
    if (index === members.length - 1) {
      membersString += member.firstName;
    } else {
      membersString += `${member.firstName}, `;
    }
  });
  return membersString;
}

export function getFilteredPreferencesOptions(position) {
  const isProfessional = position === OPTIONS.position.PROFESSIONAL;
  if (isProfessional) {
    return QUESTION_OPTIONS.preferences;
  } else {
    const filteredOptions = Object.assign(
      {},
      QUESTION_OPTIONS.preferences,
    );
    delete filteredOptions.giveProfessional;
    return filteredOptions;
  }
}
