import React from 'react';
import PropTypes from 'prop-types';
import { getMemberNames } from 'src/utils';

export default function ChatHeader(props) {
  return <div>{getMemberNames(props.members)}</div>;
}

ChatHeader.propTypes = {
  members: PropTypes.array,
};
