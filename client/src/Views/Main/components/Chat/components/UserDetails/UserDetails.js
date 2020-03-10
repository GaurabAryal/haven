import React from 'react';
import PropTypes from 'prop-types';
import './UserDetails.css';

export default function UserDetails(props) {
  return (
    <div
      className={
        props.isSelf
          ? 'user-details-container user-details-container--from-self noselect'
          : 'user-details-container noselect'
      }
    >
      <div
        className={props.isSelf ? 'triangle-right' : 'triangle-left'}
      >
        <div className="inner-triangle"></div>
      </div>
      <div className="user-details-actions">
        <p
          onClick={props.onViewUserProfile}
          className="user-details-action color--purple user-details-action--primary"
        >
          View profile
        </p>
        {!props.isSelf &&
          props.user.profile.isVerified &&
          props.meIsVerified && (
            <p
              onClick={props.onDirectMessage}
              className="user-details-action color--purple user-details-action--primary"
            >
              Message
            </p>
          )}
      </div>
      {!props.isSelf && (
        <>
          <div className="user-details-divider" />
          <p
            onClick={props.onReportUser}
            className="user-details-action color--red user-details-action--report"
          >
            Report
          </p>
        </>
      )}
    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  isSelf: PropTypes.bool,
  onReportUser: PropTypes.func,
  onViewUserProfile: PropTypes.func,
  onDirectMessage: PropTypes.func,
  meIsVerified: PropTypes.bool,
};
