import React from 'react';
import PropTypes from 'prop-types';

export default function OnboardingRow(props) {
  return (
    <div>
      <div>{props.label}</div>
      {props.children}
    </div>
  );
}

OnboardingRow.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
};
