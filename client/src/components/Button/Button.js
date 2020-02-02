import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './Button.css';

export default function Button(props) {
  return (
    <button
      class={props.isFullWidth ? `button button--full-width button--${props.variant}` : `button button--${props.variant}`}
      disabled={props.error}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']).isRequired,
  children: PropTypes.string.isRequired,
  error: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  isFullWidth: PropTypes.bool,
};
