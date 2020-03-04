import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import Button from 'src/components/Button/Button';
import ProfilePicPlaceholder from 'src/components/ProfilePicPlaceholder/ProfilePicPlaceholder';

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
        profile: { bio, interests },
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
              <ProfilePicPlaceholder
                size="sm"
                backgroundColor={getMemberColor(
                  member.id,
                  this.props.members,
                )}
              />
            </div>
            <div className="person__name text--md font-weight--bold">
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
              {bio && (
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
        <div className="text--lg">Group Members</div>
        {this.getMemberDetails()}
        <div className="text--lg spacing-top--lg spacing-bottom--sm">
          One on One
        </div>
        <div className="chat-details-verify spacing-bottom--sm">
          <ProfilePicPlaceholder
            size="sm"
            backgroundColor={getMemberColor(
              this.props.meId,
              this.props.members,
            )}
          />
          <div className="chat-details-verify-desc">
            For your security, you must be a verified member to have
            one-on-one (direct) messages. Get started below!
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
    );
  }
}

ChatDetails.propTypes = {
  members: PropTypes.array,
  meId: PropTypes.string,
  openVerifyModal: PropTypes.func,
};
