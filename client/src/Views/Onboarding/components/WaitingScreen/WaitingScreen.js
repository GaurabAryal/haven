import React from 'react';
import PropTypes from 'prop-types';
import './WaitingScreen.css';

export default function WaitingScreen(props) {
  return (
    <div className="waiting-container">
      <h2 className="text--xl font-weight--regular spacing-bottom--md">Hang tight {props.firstName}!</h2>
      <p className="text--md spacing-bottom--lg">
        We&apos;re currently looking for the perfect group match for
        you. We&apos;ll email you once you&apos;ve been added to it.
      </p>
      <div className="loadingspinner"></div>
    </div>
  );
}

WaitingScreen.propTypes = {
  firstName: PropTypes.string,
};
