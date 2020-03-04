import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './ProfilePicPlaceholder.css';
import { ReactComponent as HavenLogo } from './images/haven-logo-white.svg';

export default function ProfilePicPlaceholder(props) {
  let backgroundStyle = {
    backgroundColor: props.backgroundColor
  }

  return (
    <div style={backgroundStyle} className={
      `profile-pic-placeholder profile-pic-placeholder--${props.size}`
    }>
      <div className="profile-pic-placeholder__haven-logo">
        <HavenLogo/>
      </div>
    </div>
  );
}

ProfilePicPlaceholder.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  backgroundColor: PropTypes.string.isRequired,
};
