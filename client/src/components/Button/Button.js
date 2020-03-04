import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './Button.css';

export default function Button(props) {
  return (
    <button
      className={
        props.isFullWidth
          ? `${props.className} button button--full-width button--${props.variant}`
          : `${props.className} button button--${props.variant}`
      }
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  children: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isFullWidth: PropTypes.bool,
  className: PropTypes.string,
};
