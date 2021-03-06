import { OPTIONS, QUESTION_OPTIONS } from 'src/constants';

export function getMemberNames(members, isFullName) {
  let membersString = '';
  members.forEach((member, index) => {
    if (index === members.length - 1) {
      membersString += `${
        isFullName
          ? member.firstName + ' ' + member.lastName
          : member.firstName
      }`;
    } else {
      membersString += `${
        isFullName
          ? member.firstName + ' ' + member.lastName
          : member.firstName
      }, `;
    }
  });
  return membersString;
}

export function getOtherMembers(meId, members) {
  return members.filter(member => member.id !== meId);
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

export function getMemberColor(memberId, members) {
  const userColors = [
    '#1877F2',
    '#39CB05',
    '#EA5635',
    '#FDA700',
    '#9C42BB',
  ];
  for (let i = 0; i < members.length; i++) {
    if (members[i].id === memberId) return userColors[i];
  }
  return 'grey';
}
