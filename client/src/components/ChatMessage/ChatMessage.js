import React from 'react';
import PropTypes from 'prop-types';
import 'src/utils.css';
import './ChatMessage.css';
import { ReactComponent as StarIcon } from './images/star.svg';
import { ReactComponent as StarFilledIcon } from './images/star-filled.svg';
import { ReactComponent as ReportIcon } from './images/report.svg';

import ProfilePic from 'src/components/ProfilePic/ProfilePic';
import UserDetails from 'src/Views/Main/components/Chat/components/UserDetails/UserDetails';

export default class ChatMessage extends React.Component {
  state = { showDetails: false };
  timer = null;

  constructor(props) {
    super(props);

    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener(
      'mousedown',
      this.handleClickOutside,
    );
    clearTimeout(this.timer);
  }

  /**
   * Set the wrapper ref
   */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.setState({ showDetails: false, eventCalled: true });
      this.timer = setTimeout(() => {
        this.setState({ eventCalled: false });
      }, 100);
    }
  }

  displayDetails = () => {
    if (!this.state.showDetails && !this.state.eventCalled) {
      this.setState({ showDetails: true });
    }
  };

  onUserDetailsAction(func, params) {
    this.setState({ showDetails: false });
    func(params);
  }

  render() {
    return (
      <div
        className={
          this.props.isSelf
            ? 'message-container message-container--from-self'
            : 'message-container'
        }
      >
        {this.state.showDetails && (
          <div ref={this.setWrapperRef}>
            <UserDetails
              user={this.props.sender}
              isSelf={this.props.isSelf}
              onReportUser={() =>
                this.onUserDetailsAction(
                  this.props.onReportUser,
                  this.props.sender.id,
                )
              }
              onViewUserProfile={() =>
                this.onUserDetailsAction(
                  this.props.onViewUserProfile,
                  this.props.sender.id,
                )
              }
              onDirectMessage={() =>
                this.onUserDetailsAction(
                  this.props.onDirectMessage,
                  this.props.sender.id,
                )
              }
              meIsVerified={this.props.meIsVerified}
            />
          </div>
        )}
        <div
          className="message-container__profile-pic"
          onClick={this.displayDetails}
        >
          <ProfilePic
            imageUrl={this.props.sender.profile.profilePicture}
            isVerified={this.props.sender.profile.isVerified}
            size="md"
            backgroundColor={this.props.backgroundColor || 'grey'}
          />
        </div>
        <div
          className={
            this.props.isSelf
              ? 'message-text-wrapper message-text-wrapper--from-self'
              : 'message-text-wrapper'
          }
        >
          <div className="message-text-container">
            <div
              className={
                this.props.isSelf
                  ? 'message-text__metadata message-text__metadata--from-self'
                  : 'message-text__metadata'
              }
            >
              <p
                className="metadata__sender text--sm font-weight--bold noselect"
                onClick={this.displayDetails}
              >
                {this.props.sender.firstName}{' '}
                {this.props.sender.lastName}
              </p>
              <p className="metadata__time text--xs font-weight--regular noselect">
                {this.props.time}
              </p>
            </div>
            <div
              className={
                this.props.isSelf
                  ? 'message-text message-text--from-self'
                  : 'message-text'
              }
            >
              <div
                className={
                  this.props.isSelf
                    ? 'message-text__content message-text__content--from-self text--md font-weight--regular'
                    : 'message-text__content text--md font-weight--regular'
                }
              >
                {this.props.message.text}
              </div>
              <div
                className={
                  this.props.isSelf
                    ? 'message-text-content__actions message-text-content__actions--from-self'
                    : 'message-text-content__actions'
                }
              >
                <div className="message-text-content__action">
                  {!this.props.isMessageSaved ? (
                    <div
                      className="message-action__icon"
                      onClick={() =>
                        this.props.onSaveMessage(
                          this.props.message.chatId
                        )
                      }
                    >
                      <StarIcon />
                    </div>
                  ) : (
                    <div
                      className="message-action__icon"
                      onClick={() =>
                        this.props.onSaveMessage(
                          this.props.message.chatId
                        )
                      }
                    >
                      <StarFilledIcon />
                    </div>
                  )}
                  <div className="message-action-tooltip">
                    <p className="message-text-content__action-text text--xs">
                      {!this.props.isMessageSaved ? "Save" : "Unsave"}
                    </p>
                    <div className="message-triangle" />
                  </div>
                </div>
                {!this.props.isSelf && (
                  <div className="message-text-content__action">
                    <div
                      onClick={() =>
                        this.props.onReportUser(this.props.sender.id)
                      }
                      className="message-action__icon"
                    >
                      <ReportIcon />
                    </div>
                    <div className="message-action-tooltip">
                      <p className="message-text-content__action-text text--xs">
                        Report
                      </p>
                      <div className="message-triangle" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ChatMessage.propTypes = {
  sender: PropTypes.object.isRequired,
  message: PropTypes.object.isRequired,
  time: PropTypes.string,
  image: PropTypes.string,
  isSelf: PropTypes.bool,
  backgroundColor: PropTypes.string,
  onReportUser: PropTypes.func,
  onViewUserProfile: PropTypes.func,
  onSaveMessage: PropTypes.func,
  onDirectMessage: PropTypes.func,
  isMessageSaved: PropTypes.bool,
  meIsVerified: PropTypes.bool,
};
