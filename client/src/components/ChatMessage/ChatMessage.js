import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './ChatMessage.css';
import ProfilePicPlaceholder from 'src/components/ProfilePicPlaceholder/ProfilePicPlaceholder';

export default function ChatMessage(props) {
  return (
    <div
      className={
        props.isSelf === true
          ? 'message-container message-container--from-self'
          : 'message-container'
      }
    >
      <ProfilePicPlaceholder
        size="md"
        backgroundColor={props.backgroundColor || "grey"}
      />
      <div className={
        props.isSelf === true
          ? 'message-text-wrapper message-text-wrapper--from-self'
          : 'message-text-wrapper'
      }>
        <div className="message-text-container">
        <div
          className={
            props.isSelf === true
              ? 'message-text__metadata message-text__metadata--from-self'
              : 'message-text__metadata'
          }
        >
          <p className="metadata__sender text--sm font-weight--bold">
            {props.sender}
          </p>
          <p className="metadata__time text--xs font-weight--regular">
            {props.time}
          </p>
        </div>
        <div
          className={
            props.isSelf === true
              ? 'message-text__content message-text__content--from-self text--md font-weight--regular'
              : 'message-text__content text--md font-weight--regular'
          }
        >
          {props.message}
        </div>
      </div>
      </div>
    </div>
  );
}

ChatMessage.propTypes = {
  sender: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  time: PropTypes.string,
  image: PropTypes.string,
  isSelf: PropTypes.bool,
  backgroundColor: PropTypes.string,
};
