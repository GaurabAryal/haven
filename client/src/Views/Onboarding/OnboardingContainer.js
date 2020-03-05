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
      id
    }
    membership {
      id
      members {
        id
      }
    }
  }
`;

const ONBOARDING_MUTATION = gql`
  mutation OnboardingMutation(
    $position: String!
    $bio: String!
    $interests: String!
    $city: String!
    $country: String!
    $preferenceList: [Int]
    $userId: String!
    $image: Upload
  ) {
    createProfile(
      profileInput: {
        position: $position
        bio: $bio
        interests: $interests
        profilePicture: $image
      }
    ) {
      profile {
        id
      }
    }

    matchGroup(
      preferenceList: $preferenceList
      userId: $userId
      city: $city
      country: $country
    ) {
      group {
        id
      }
    }
  }
`;

const OnboardingPageContainer = props => (
  <Query query={GET_USER_QUERY}>
    {({ loading, error, data, startPolling, stopPolling }) => {
      if (loading) return <div />;
      if (error) return <div />;

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
          onboardingMutation={props.onboardingMutation}
          startPolling={startPolling}
          stopPolling={stopPolling}
          goToApp={() => props.history.push('/')}
          userId={data.me.id}
        />
      );
    }}
  </Query>
);

OnboardingPageContainer.propTypes = {
  onboardingMutation: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
};

export default compose(
  graphql(ONBOARDING_MUTATION, { name: 'onboardingMutation' }),
)(OnboardingPageContainer);
