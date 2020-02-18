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
