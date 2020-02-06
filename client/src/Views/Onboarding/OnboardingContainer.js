import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';
import gql from 'graphql-tag';

import OnboardingPage from './OnboardingPage';

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

export default compose(
  graphql(CREATE_PROFILE_MUTATION, { name: 'createProfileMutation' }),
)(OnboardingPage);
