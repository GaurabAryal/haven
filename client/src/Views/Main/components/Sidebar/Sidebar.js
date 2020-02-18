import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from 'src/components/Button/Button';
import { withRouter } from 'react-router-dom';

import { AUTH_TOKEN } from 'src/constants';
import { getMemberNames } from 'src/utils';

import './Sidebar.css';

class Sidebar extends React.Component {
  state = {
    selectedGroup: null,
  };

  renderGroups() {
    const id = this.props.match.params?.id || null;
    return this.props.groups.map(group => (
      <Link
        to={`/${group.id}`}
        key={group.id}
        style={{ textDecoration: 'none', color: 'black' }}
      >
        <div
          className={`sidebar-pill ${id === group.id &&
            'sidebar-pill_selected'}`}
        >
          <div>{getMemberNames(group.members)}</div>
          <div>the latest chat that ill figure out later</div>
        </div>
      </Link>
    ));
  }

  logout = () => {
    if (localStorage[AUTH_TOKEN]) {
      localStorage.removeItem(AUTH_TOKEN);
    }

    this.props.history.push('/login');
  };

  render() {
    return (
      <div className="sidebar-container">
        <div onClick={() => this.props.history.push('/')}>Haven</div>
        {this.renderGroups()}
        <Button
          variant="secondary"
          onClick={() => this.props.history.push('/community')}
        >
          Join a new community
        </Button>
        <div onClick={this.logout}>Logout</div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  groups: PropTypes.array,
  history: PropTypes.object,
  match: PropTypes.object,
};

export default withRouter(Sidebar);
