import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import { Redirect } from 'react-router-dom';

import OnboardingPage from './OnboardingPage';
import { MIN_GROUP_SIZE } from 'src/constants';

const GET_USER_QUERY = gql`
  {
    me {
      firstName
    }
    membership {
      id
      members {
        id
      }
    }
  }
`;

const CREATE_PROFILE_MUTATION = gql`
  mutation CreateProfileMutation(
    $position: String!
    $bio: String!
    $interests: String!
    $city: String!
    $country: String!
  ) {
    createProfile(
      profileInput: {
        position: $position
        bio: $bio
        interests: $interests
        city: $city
        country: $country
      }
    ) {
      profile {
        id
      }
    }
  }
`;

const OnboardingPageContainer = props => (
  <Query query={GET_USER_QUERY}>
    {({ loading, error, data, startPolling, stopPolling }) => {
      if (loading) return <div />;
      if (error) return `Error! ${error.message}`;

      const groupMembersAmount =
        data.membership[0]?.members?.length || 0;
      const firstName = data.me?.firstName || '';

      if (groupMembersAmount >= MIN_GROUP_SIZE) {
        return (
          <Redirect
            to={{
              pathname: `/t/${data.membership[0].id}`,
              state: { from: props.location },
            }}
          />
        );
      }

      return (
        <OnboardingPage
          firstName={firstName}
          groupMembersAmount={groupMembersAmount}
          createProfileMutation={props.createProfileMutation}
          startPolling={startPolling}
          stopPolling={stopPolling}
          goToApp={() => props.history.push('/')}
        />
      );
    }}
  </Query>
);

OnboardingPageContainer.propTypes = {
  createProfileMutation: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default compose(
  graphql(CREATE_PROFILE_MUTATION, { name: 'createProfileMutation' }),
)(OnboardingPageContainer);
