import React from 'react';
import PropTypes from 'prop-types';
import './UserDetails.css';

export default function UserDetails(props) {
  return (
    <div className={props.isSelf
      ? "user-details-container user-details-container--from-self"
      : "user-details-container"
    }>
      <div className="user-details-actions">
        <p className="user-details-action color--purple user-details-action--primary">
          View profile
        </p>
        <p className="user-details-action color--purple user-details-action--primary">
          Message
        </p>
      </div>
      <p className="user-details-action color--red user-details-action--report">
        Report
      </p>
    </div>
  );
}

UserDetails.propTypes = {
  user: PropTypes.object.isRequired,
  isSelf: PropTypes.bool
};
