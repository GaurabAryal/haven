import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './OnboardingRow.css';

export default function OnboardingRow(props) {
  return (
    <div className="spacing-top--lg">
      <h3 className="question-heading text--md font-weight--semi-bold">{props.label}</h3>
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
