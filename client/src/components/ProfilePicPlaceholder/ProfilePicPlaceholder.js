import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './ProfilePicPlaceholder.css';

export default function ProfilePicPlaceholder(props) {
  let backgroundStyle = {
    backgroundColor: props.backgroundColor
  }

  return (
    <div style={backgroundStyle} className={
      `profile-pic-placeholder profile-pic-placeholder--${props.size}`
    }>
      {props.firstName[0] + props.lastName[0]}
    </div>
  );
}

ProfilePicPlaceholder.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
