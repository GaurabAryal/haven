import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './ProfilePicPlaceholder.css';
import { ReactComponent as HavenLogo } from './images/haven-logo-white.svg';
import { ReactComponent as VerifiedBadge } from './images/check-badge.svg';

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
        {
          props.isVerified && <div className="verified-badge">
            <VerifiedBadge/>
          </div>
        }
      </div>
    </div>
  );
}

ProfilePicPlaceholder.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isVerified: PropTypes.bool,
};
