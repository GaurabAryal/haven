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

  toggleDetails(id) {
    const openDetails = Object.assign({}, this.state.openDetails);
    openDetails[id] = !openDetails[id];
    this.setState({ openDetails });
  }

  getMemberDetails() {
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
          className="person-container noselect"
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
              <div className="spacing-bottom--sm">{bio}</div>
              {position && position !== 'other' && (
                <div className="spacing-bottom--sm">
                  <b>{`${firstName} is`}</b>
                  <div>{`A ${position} of a person with dementia`}</div>
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

  render() {
    return (
      <div className="chat-details-container">
        {!this.props.meIsVerified && (
          <div className="spacing-bottom--lg">
            <div className="text--md-lg spacing-bottom--md">
              One on One
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
                For your security, you must be a verified member to
                have one-on-one (direct) messages. Get started below!
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
};
