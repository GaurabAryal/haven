import React from 'react';
import PropTypes from 'prop-types';

export default function WaitingScreen(props) {
  return (
    <div>
      <div>Hang tight {props.firstName}!</div>
      <div>
        We&apos;re currently looking for the perfect group match for
        you. We&apos;ll email you once you&apos;ve been added to it.
      </div>
      <div>SPINNING THING</div>
    </div>
  );
}

WaitingScreen.propTypes = {
  firstName: PropTypes.string,
};
