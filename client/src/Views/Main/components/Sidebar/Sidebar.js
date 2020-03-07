import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'src/components/Button/Button';
import ProfilePic from 'src/components/ProfilePic/ProfilePic';
import { withRouter } from 'react-router-dom';
import { MIN_GROUP_SIZE } from 'src/constants';
import { ReactComponent as HavenLogo } from 'src/Views/Onboarding/images/haven-logo-small.svg';

import { getMemberNames, getMemberColor } from 'src/utils';

import './Sidebar.css';

class Sidebar extends React.Component {
  state = {
    selectedGroup: null,
  };

  renderProfilePics(members) {
    const profilePics = [];
    let offsetStyle = {
      left: `${25}px`,
    };
    console.log(members)
    profilePics.push(
      <div
        key={members[0].id}
        className="sidebar-pill__profile-pics-wrapper"
        style={offsetStyle}
      >
        <ProfilePic
          imageUrl={members[0].profile.profilePicture}
          backgroundColor={getMemberColor(members[0].id, members)}
          size="sm"
        />
      </div>,
    );
    profilePics.push(
      <div
        className="sidebar-pill__profile-pics-wrapper"
        key={members[1].id}
      >
        <ProfilePic
          imageUrl={members[0].profile.profilePicture}
          backgroundColor={getMemberColor(members[1].id, members)}
          size="sm"
        />
      </div>,
    );
    return profilePics;
  }

  renderGroups() {
    const id = this.props.match.params?.id || null;
    return this.props.groups.map(group =>
      group.members?.length >= MIN_GROUP_SIZE ? (
        <Link
          to={`/t/${group.id}`}
          key={group.id}
          style={{ textDecoration: 'none', color: 'black' }}
        >
          <div
            className={`sidebar-pill ${id === group.id &&
              'sidebar-pill--selected'}`}
          >
            <div className="sidebar-pill__profile-pics">
              {this.renderProfilePics(group.members)}
            </div>
            <div className="sidebar-pill__text">
              <div className="add-ellipses text--md sidebar-pill-text__names">
                {getMemberNames(group.members)}
              </div>
              <div className="add-ellipses text--sm sidebar-pill-text__message">
                the latest chat that ill figure out later
              </div>
            </div>
          </div>
        </Link>
      ) : null,
    );
  }

  render() {
    return (
      <div className="sidebar-container">
        <div className="haven-logo spacing-bottom--md margin-15">
          <HavenLogo />
        </div>
        {this.renderGroups()}
        <div className="spacing-top--md margin-15">
          <Button
            variant="secondary"
            onClick={() => this.props.history.push('/community')}
            isFullWidth={true}
          >
            Join more communities
          </Button>
        </div>
        <div className="logout text--md color--grey" onClick={this.props.logout}>
          Sign out
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  groups: PropTypes.array,
  history: PropTypes.object,
  match: PropTypes.object,
  logout: PropTypes.func,
};

export default withRouter(Sidebar);
