import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import Button from 'src/components/Button/Button';

export default function Modal(props) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onAfterOpen={props.onAfterOpen}
      onRequestClose={props.onClose}
      appElement={document.getElementById('root')}
      contentLabel="Modal"
    >
      <div>
        <div onClick={props.onClose}>X</div>
        <div>{props.header}</div>
        {props.children}
        <Button variant="primary" onClick={props.onButtonClick}>
          {props.buttonText}
        </Button>
      </div>
    </ReactModal>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onAfterOpen: PropTypes.func,
  onClose: PropTypes.func,
  children: PropTypes.element,
  header: PropTypes.string,
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
};
