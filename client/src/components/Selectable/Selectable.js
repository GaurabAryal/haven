import React from 'react';
import PropTypes from 'prop-types';
import './Selectable.css';

export default function Selectable(props) {
  return props.children ? (
    <div
      className={props.isSelected ? 'selected' : 'notSelected'}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  ) : null;
}

Selectable.propTypes = {
  isSelected: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};
