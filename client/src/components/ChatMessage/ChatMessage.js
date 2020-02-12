import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css'
import './ChatMessage.css';

export default function ChatMessage(props) {
  return (
    <div className={
      props.isSelf === true ?
      "message-container message-container--from-self" :
      "message-container"
    }>
      <div className="message-container__profile-pic"></div>
      <div className="message-text-container">
        <div className={
          props.isSelf === true ?
          "message-text__metadata message-text__metadata--from-self" :
          "message-text__metadata"
        }>
          <p className="metadata__sender text--sm font-weight--bold">
            {props.sender}
          </p>
          <p className="metadata__time text--xs font-weight--regular">
            {props.time}
          </p>
        </div>
        <div className={
          props.isSelf === true ?
          "message-text__content message-text__content--from-self text--md font-weight--regular" :
          "message-text__content text--md font-weight--regular"
        }>
          {props.message}
        </div>
      </div>
    </div>

  );
}

ChatMessage.propTypes = {
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  isSelf: PropTypes.bool,
};
