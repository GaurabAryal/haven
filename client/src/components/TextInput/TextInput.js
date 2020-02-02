import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './TextInput.css';

export default function TextInput(props) {
  return (
    <div className={props.isHalfWidth ? 'text-input-container flex-1' : 'text-input-container'}>
      <label className="text-input__label text--sm font-weight--semi-bold">{props.label}</label>
      <input
        type={props.type || 'text'}
        value={props.value || ''}
        placeholder={props.placeholder || ''}
        onChange={props.onChange}
      />
    </div>
  );
}

TextInput.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  isHalfWidth: PropTypes.bool,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
