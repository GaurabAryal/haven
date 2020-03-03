import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import { Redirect } from 'react-router-dom';
import { MIN_GROUP_SIZE } from 'src/constants';
import { Switch, Route } from 'react-router-dom';
import './MainPage.css';
import { AUTH_TOKEN } from 'src/constants';

import Sidebar from './components/Sidebar/Sidebar';
import ChatContainer from './components/Chat/ChatContainer';
import CommunityContainer from './components/Community/CommunityContainer';

const GET_USER_QUERY = gql`
  {
    me {
      id
      firstName
    }
    membership {
      id
      members {
        id
        firstName
        lastName
      }
    }
  }
`;

export default class MainPageContainer extends React.Component {
  state = {};

  logout = async client => {
    if (localStorage[AUTH_TOKEN]) {
      localStorage.removeItem(AUTH_TOKEN);
    }
    await client.clearStore();
    this.props.history.push('/login');
  };

  render() {
    return (
      <Query query={GET_USER_QUERY}>
        {({ client, loading, error, data }) => {
          if (loading) return <div />;
          if (error) return `Error! ${error.message}`;

          const groupMembersAmount =
            data.membership[0]?.members?.length || 0;

          if (groupMembersAmount < MIN_GROUP_SIZE) {
            return (
              <Redirect
                to={{
                  pathname: '/onboarding',
                  state: { from: this.props.location },
                }}
              />
            );
          }

          return (
            <div className="mainpage-container">
              <Sidebar
                groups={data.membership}
                logout={() => this.logout(client)}
              />
              <Switch>
                <Route
                  path="/community"
                  component={CommunityContainer}
                />
                <Route path="/t/:id" component={ChatContainer} />
                <Route exact path="/">
                  <Redirect to={`/t/${data.membership[0].id}`} />
                </Route>
              </Switch>
            </div>
          );
        }}
      </Query>
    );
  }
}

MainPageContainer.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
};
