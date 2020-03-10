import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './ProfilePic.css';
import { ReactComponent as HavenLogo } from './images/haven-logo-white.svg';
import { ReactComponent as VerifiedBadge } from './images/check-badge.svg';
import { ReactComponent as VerifiedBadgeSmall } from 'src/Views/Onboarding/images/check-badge-small.svg';

export default function ProfilePic(props) {
  let backgroundStyle = {
    backgroundColor: props.backgroundColor
  }

  return (
    props.imageUrl
      ? <div className={`profile-pic-container profile-pic-container--${props.size}`}
        style={{backgroundImage: `url(https://haven-storage.nyc3.digitaloceanspaces.com/media/${props.imageUrl})`}}
      >
        {
          props.isVerified &&
            <div className={
              props.size === "sm"
              ? "verified-badge verified-badge--sm"
              : "verified-badge"}>
              {props.size === "sm" ? <VerifiedBadgeSmall/> : <VerifiedBadge/>}
            </div>
        }
      </div>
      : <div style={backgroundStyle} className={
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

ProfilePic.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  backgroundColor: PropTypes.string.isRequired,
  isVerified: PropTypes.bool,
  imageUrl: PropTypes.string,
};
