import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';

import OnboardingPage from './OnboardingPage';

const GET_USER_QUERY = gql`
  {
    me {
      profile {
        onboardingDone
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
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return `Error! ${error.message}`;

      const isOnboardingDone =
        data.me?.profile?.onboardingDone || false;

      return (
        <OnboardingPage
          firstName="James"
          initialStep={isOnboardingDone ? 3 : null}
          createProfileMutation={props.createProfileMutation}
        />
      );
    }}
  </Query>
);

OnboardingPageContainer.propTypes = {
  createProfileMutation: PropTypes.func,
};

export default compose(
  graphql(CREATE_PROFILE_MUTATION, { name: 'createProfileMutation' }),
)(OnboardingPageContainer);
