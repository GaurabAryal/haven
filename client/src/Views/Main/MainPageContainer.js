import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import { Redirect } from 'react-router-dom';
import { MIN_GROUP_SIZE } from 'src/constants';
import { Switch, Route } from 'react-router-dom';
import './MainPage.css';

import Sidebar from './components/Sidebar/Sidebar';

const GET_USER_QUERY = gql`
  {
    me {
      firstName
    }
    membership {
      id
      members {
        id
        firstName
      }
    }
  }
`;

export default class MainPageContainer extends React.Component {
  state = {};

  render() {
    return (
      <Query query={GET_USER_QUERY}>
        {({ loading, error, data }) => {
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
              <Sidebar groups={data.membership} />
              <Switch>
                <Route path="/community">
                  <div>hi</div>
                </Route>
                <Route path="/:id">
                  <div>hi2</div>
                </Route>
                <Route exact path="/">
                  <div>hi3</div>
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
