import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from 'src/components/Button/Button';
import ProfilePic from 'src/components/ProfilePic/ProfilePic';

import { ReactComponent as ChevronDown } from './images/chevron-down.svg';
import { getMemberColor } from 'src/utils';

export default class ChatDetails extends React.Component {
  state = {
    openDetails: {},
    showVerifyModal: false,
  };

  componentDidMount() {
    if (this.props.userIdToView) {
      this.openDetailsAndCloseOthers(this.props.userIdToView);
    }
  }

  componentDidUpdate() {
    if (this.props.userIdToView) {
      this.openDetailsAndCloseOthers(this.props.userIdToView);
    }
  }

  openDetailsAndCloseOthers(id) {
    const openDetails = {};
    openDetails[id] = true;
    this.setState({ openDetails });
    this.props.clearUserIdToView();
  }

  toggleDetails(id) {
    const openDetails = Object.assign({}, this.state.openDetails);
    openDetails[id] = !openDetails[id];
    this.setState({ openDetails });
  }

  getMemberDetails() {
    const userIdToView = this.props.userIdToView;
    return this.props.members.map((member, index) => {
      const {
        id,
        dateJoined,
        firstName,
        lastName,
        profile: { bio, interests, position },
      } = member;

      return (
        <div
          key={firstName + index}
          className={
            member.id === userIdToView
              ? 'person-container person-container--highlighted noselect'
              : 'person-container noselect'
          }
        >
          <div
            onClick={() => this.toggleDetails(id)}
            className="person"
          >
            <div className="person__pic">
              <ProfilePic
                size="sm"
                imageUrl={member.profile.profilePicture}
                isVerified={member.profile.isVerified}
                backgroundColor={getMemberColor(
                  member.id,
                  this.props.members,
                )}
              />
            </div>
            <div className="person__name text--sm font-weight--bold">
              {`${firstName} ${lastName}`}{' '}
              {id === this.props.meId && '(You)'}
            </div>

            <span>
              <ChevronDown
                className={
                  this.state.openDetails[id]
                    ? 'chevron chevron--up'
                    : 'chevron chevron--down'
                }
              />
            </span>
          </div>
          {this.state.openDetails[id] && (
            <div>
              {id !== this.props.meId && member.profile.isVerified && (
                <div
                  onClick={() =>
                    this.props.onDirectMessage(member.id)
                  }
                  className="spacing-bottom--sm chat-detail-user-action"
                >
                  Message
                </div>
              )}
              {member.profile.profilePicture && (
                <div
                  className="person__profile-pic spacing-bottom--sm"
                  style={{
                    backgroundImage: `url(https://haven-storage.nyc3.digitaloceanspaces.com/media/${member.profile.profilePicture})`,
                  }}
                />
              )}
              <div className="spacing-bottom--sm">{bio}</div>
              {position &&
                position !== 'other' &&
                position !== 'unknown' && (
                  <div className="spacing-bottom--sm">
                    <b>{`${firstName} is`}</b>
                    {position === 'professional' && (
                      <div>A professional caregiver</div>
                    )}
                    {position !== 'professional' && (
                      <div>
                        A {position} of a person with dementia
                      </div>
                    )}
                  </div>
                )}
              {interests && (
                <div>
                  <b>Ask me about</b>
                  <div>{interests}</div>
                </div>
              )}
              <div className="spacing-top--sm spacing-bottom--md">
                <b>Joined Haven</b>
                <div>{moment(dateJoined).format('MMMM YYYY')}</div>
              </div>
            </div>
          )}
        </div>
      );
    });
  }

  getSavedMessages() {
    return this.props.savedMessages.length ? (
      <div className="spacing-bottom--lg">
        <div className="text--md-lg spacing-bottom--md">
          Saved messages
        </div>
        {this.props.savedMessages.map((message, index) => {
          return (
            <div className="saved-message-container" key={message.id + index}>
              <span className="text--sm font-weight--bold">
                {message.user.firstName} {message.user.id !== this.props.meId && message.user.lastName} {message.user.id === this.props.meId && "(You)"}&nbsp;&nbsp;
              </span>
              <span className="text--xs color--grey">{moment(message.chatTime).calendar()}</span>
              <div><div className="spacing-top--xs saved-message">{message.message}</div></div>
            </div>
          );
        })}
      </div>
    ) : null;
  }

  render() {
    return (
      <div className="chat-details-container">
        {!this.props.meIsVerified && (
          <div className="spacing-bottom--lg">
            <div className="text--md-lg spacing-bottom--md">
              Verify your account
            </div>
            <div className="chat-details-verify spacing-bottom--md">
              <ProfilePic
                size="md"
                backgroundColor={getMemberColor(
                  this.props.meId,
                  this.props.members,
                )}
                isVerified={true}
                imageUrl={this.props.meImageUrl}
              />
              <div className="chat-details-verify-desc">
                Become a verified member to start one-on-one messages
                and be able to send links, emails, and phone numbers.
                Get started below!
              </div>
            </div>
            <Button
              isFullWidth
              onClick={this.props.openVerifyModal}
              variant="secondary"
            >
              Become a verified member
            </Button>
          </div>
        )}
        {this.getSavedMessages()}
        <div className="text--md-lg spacing-bottom--sm">
          Group Members
        </div>
        {this.getMemberDetails()}
      </div>
    );
  }
}

ChatDetails.propTypes = {
  members: PropTypes.array.isRequired,
  meId: PropTypes.string.isRequired,
  meImageUrl: PropTypes.string,
  meIsVerified: PropTypes.bool,
  openVerifyModal: PropTypes.func,
  clearUserIdToView: PropTypes.func,
  userIdToView: PropTypes.string,
  savedMessages: PropTypes.array,
  onDirectMessage: PropTypes.func,
};
