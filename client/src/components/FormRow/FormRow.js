import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './FormRow.css';

export default function FormRow(props) {
  return (
    <div className={props.halfTopSpacing ? "spacing-top--md" : "spacing-top--lg"}>
      <h3 className="question-heading text--md font-weight--semi-bold">
        {props.label}
      </h3>
      {props.children}
    </div>
  );
}

FormRow.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
  halfTopSpacing: PropTypes.bool,
};
