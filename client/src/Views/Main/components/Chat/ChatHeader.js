import React from 'react';
import PropTypes from 'prop-types';
import { getMemberNames } from 'src/utils';

export default function ChatHeader(props) {
  return <div className="text--lg font-weight--bold">{getMemberNames(props.members)}</div>;
}

ChatHeader.propTypes = {
  members: PropTypes.array,
};
