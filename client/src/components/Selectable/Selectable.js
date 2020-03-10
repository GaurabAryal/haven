import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as CheckmarkBadge } from 'src/Views/Onboarding/images/check-badge-small.svg';
import './Selectable.css';

export default function Selectable(props) {
  return props.children ? (
    <div
      className={props.isSelected ? 'selectable selectable--selected' : 'selectable'}
      onClick={props.onClick}
    >
      <div className="checkmark-badge">
        <CheckmarkBadge/>
      </div>
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
