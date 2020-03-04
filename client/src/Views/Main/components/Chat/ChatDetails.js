import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ProfilePicPlaceholder from 'src/components/ProfilePicPlaceholder/ProfilePicPlaceholder';
import { ReactComponent as ChevronDown } from './images/chevron-down.svg';

export default class ChatHeader extends React.Component {
  state = {
    openDetails: {},
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
        <div key={firstName + index} className="person-container noselect">
          <div onClick={() => this.toggleDetails(id)} className="person">
            <div className="person__pic">
              <ProfilePicPlaceholder
                firstName={firstName[0]}
                lastName={lastName[0]}
                size="sm"
                backgroundColor="grey"
              />
            </div>
            <div className="person__name text--sm font-weight--bold">
              {`${firstName} ${lastName}`}{' '}
              {id === this.props.meId && '(You)'}
            </div>

            <span>
              <ChevronDown className={
                this.state.openDetails[id] ?
                'chevron chevron--up' :
                'chevron chevron--down'
              }/>
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
        <div className="text--md">
          Group Members
        </div>
        {this.getMemberDetails()}
      </div>
    );
  }
}

ChatHeader.propTypes = {
  members: PropTypes.array,
  meId: PropTypes.string,
};
