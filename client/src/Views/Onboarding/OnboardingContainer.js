import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from '@apollo/react-components';
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

// class OnboardingContainer extends React.Component {
//   createProfile = async profileInput => {
//     const { position, bio, interests, city, country } = profileInput;
//     await this.props.createProfileMutation({
//       variables: {
//         position,
//         bio,
//         interests,
//         city,
//         country,
//       },
//     });

//     this.props.history.push(`/`);
//   };

//   _confirm(data) {
//     console.log('data', data);
//   }

//   render() {
//     return (
//       <Mutation
//         mutation={CREATE_PROFILE_MUTATION}
//         variables={{ position, password, firstName, lastName }}
//         onCompleted={data => this._confirm(data)}
//       >
//         <OnboardingPage
//           firstName="James"
//           createProfile={this.createProfile}
//         />
//       </Mutation>
//     );
//   }
// }

// OnboardingContainer.propTypes = {
//   createProfileMutation: PropTypes.func,
//   history: PropTypes.object,
// };

export default compose(
  graphql(CREATE_PROFILE_MUTATION, { name: 'createProfileMutation' }),
)(OnboardingPage);
