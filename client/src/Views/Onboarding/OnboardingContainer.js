import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/react-components';
import { gql, graphql, compose } from 'react-apollo';

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

class OnboardingContainer extends React.Component {
  createProfile = async profileInput => {
    const { position, bio, interests, city, country } = profileInput;
    await this.props.createProfileMutation({
      variables: {
        position,
        bio,
        interests,
        city,
        country,
      },
    });

    this.props.history.push(`/`);
  };

  render() {
    return (
      <Mutation>
        <OnboardingPage
          firstName="James"
          createProfile={this.createProfile}
        />
      </Mutation>
    );
  }
}

OnboardingContainer.propTypes = {
  createProfileMutation: PropTypes.func,
  history: PropTypes.object,
};

export default compose(
  graphql(CREATE_PROFILE_MUTATION, { name: 'createProfileMutation' }),
)(OnboardingContainer);
