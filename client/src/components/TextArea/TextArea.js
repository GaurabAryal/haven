import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './TextArea.css';

export default function TextInput(props) {
  return (
    <div className="textarea-container">
      <textarea
        rows={props.initialRowHeight || 3}
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
}

TextInput.propTypes = {
  initialRowHeight: PropTypes.number,
  value: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
