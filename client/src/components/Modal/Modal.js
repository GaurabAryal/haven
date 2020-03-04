import React from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import './Modal.css';
import { ReactComponent as CloseIcon } from './images/X.svg';

import Button from 'src/components/Button/Button';

export default function Modal(props) {
  return (
    <ReactModal
      isOpen={props.isOpen}
      onAfterOpen={props.onAfterOpen}
      onRequestClose={props.onClose}
      appElement={document.getElementById('root')}
      contentLabel="Modal"
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        },
        content: {
          maxWidth: props.width,
          height: props.height || 'auto',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      }}
    >
      <CloseIcon onClick={props.onClose} className="close-btn" />
      <div className="modal-content">
        <div className="text--lg modal-header spacing-bottom--md">
          {props.header}
        </div>
        {props.children}
        <Button
          className="modal-button spacing-bottom--sm"
          variant="primary"
          onClick={props.onButtonClick}
          isFullWidth={true}
        >
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
