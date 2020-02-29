import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'src/components/Button/Button';
import ProfilePicPlaceholder from 'src/components/ProfilePicPlaceholder/ProfilePicPlaceholder';
import { withRouter } from 'react-router-dom';
import { MIN_GROUP_SIZE } from 'src/constants';

import { getMemberNames } from 'src/utils';

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
    profilePics.push(
      <div
        key={members[0].id}
        className="sidebar-pill__profile-pics-wrapper"
        style={offsetStyle}
      >
        <ProfilePicPlaceholder
          firstName={members[0].firstName}
          lastName={members[0].lastName}
          backgroundColor="teal"
          size="sm"
        />
      </div>,
    );
    profilePics.push(
      <div
        className="sidebar-pill__profile-pics-wrapper"
        key={members[1].id}
      >
        <ProfilePicPlaceholder
          firstName={members[1].firstName}
          lastName={members[1].lastName}
          backgroundColor="magenta"
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
              <div className="text--md">
                {getMemberNames(group.members)}
              </div>
              <div className="text--sm color--grey">
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
        <div className="text--lg font-weight--bold spacing-bottom--sm">
          Haven
        </div>
        {this.renderGroups()}
        <div className="spacing-top--md">
          <Button
            variant="secondary"
            onClick={() => this.props.history.push('/community')}
            isFullWidth={true}
          >
            Join more communities
          </Button>
        </div>
        <div className="logout text--md" onClick={this.props.logout}>
          Logout
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
