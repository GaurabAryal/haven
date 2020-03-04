import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './ChatMessage.css';
import { ReactComponent as HeartIcon } from './images/heart.svg';
import { ReactComponent as StarIcon } from './images/star.svg';
import { ReactComponent as ReportIcon } from './images/report.svg';
import ProfilePicPlaceholder from 'src/components/ProfilePicPlaceholder/ProfilePicPlaceholder';

export default function ChatMessage(props) {
  return (
    <div
      className={
        props.isSelf
          ? 'message-container message-container--from-self'
          : 'message-container'
      }
    >
      <div className="message-container__profile-pic">
        <ProfilePicPlaceholder
          size="md"
          backgroundColor={props.backgroundColor || "grey"}
        />
      </div>
      <div className={
        props.isSelf
          ? 'message-text-wrapper message-text-wrapper--from-self'
          : 'message-text-wrapper'
      }>
        <div className="message-text-container">
        <div
          className={
            props.isSelf
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
        <div className={props.isSelf ? "message-text message-text--from-self" : "message-text"}>
          <div
            className={
              props.isSelf
                ? 'message-text__content message-text__content--from-self text--md font-weight--regular'
                : 'message-text__content text--md font-weight--regular'
            }
          >
            {props.message}
          </div>
          <div className={
            props.isSelf ?
            "message-text-content__actions message-text-content__actions--from-self" :
            "message-text-content__actions"
          }>
            <div className="message-text-content__action">
              <div className="message-action__icon">
                <HeartIcon/>
              </div>
              <div className="message-action-tooltip">
                <p className="message-text-content__action-text text--xs">Like</p>
                <div className="message-triangle"/>
              </div>
            </div>
            <div className="message-text-content__action">
              <div className="message-action__icon">
                <StarIcon/>
              </div>
              <div className="message-action-tooltip">
                <p className="message-text-content__action-text text--xs">Save</p>
                <div className="message-triangle"/>
              </div>
            </div>
            {
              !props.isSelf && <div className="message-text-content__action">
                <div className="message-action__icon">
                  <ReportIcon/>
                </div>
                <div className="message-action-tooltip">
                  <p className="message-text-content__action-text text--xs">Report</p>
                  <div className="message-triangle"/>
                </div>
              </div>
            }
          </div>
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
