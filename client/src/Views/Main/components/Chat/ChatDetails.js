import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

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
        <div key={firstName + index} className="chatDetails">
          <div onClick={() => this.toggleDetails(id)}>
            <b>
              {`${firstName} ${lastName}`}{' '}
              {id === this.props.meId && '(You)'}
            </b>
            <span>{this.state.openDetails[id] ? 'v' : '^'}</span>
          </div>
          {this.state.openDetails[id] && (
            <div>
              <div>{bio}</div>
              {bio && (
                <div>
                  <b>Ask me about</b>
                  <div>{interests}</div>
                </div>
              )}
              <div>
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
      <div>
        <div>Group Members</div>
        {this.getMemberDetails()}
      </div>
    );
  }
}

ChatHeader.propTypes = {
  members: PropTypes.array,
  meId: PropTypes.string,
};
