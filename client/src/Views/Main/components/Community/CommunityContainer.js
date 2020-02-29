import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { Query } from '@apollo/react-components';
import { compose } from 'recompose';

import CommunityScreen from './CommunityScreen.js';

const GET_USER_QUERY = gql`
  {
    me {
      firstName
      profile {
        position
      }
    }
    membership {
      id
      members {
        id
      }
    }
  }
`;

const JOIN_COMMUNITY_MUTATION = gql`
  mutation JoinCommunityMutation(
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

const CommunityContainer = props => {
  return (
    <Query query={GET_USER_QUERY}>
      {({ loading, error, data, startPolling, stopPolling }) => {
        if (loading) return <div />;
        if (error) return `Error! ${error.message}`;

        const groupMembersAmount =
          data.membership[0]?.members?.length || 0;

        return (
          <CommunityScreen
            firstName={data.me?.firstName || ''}
            position={data.me?.position || ''}
            groupMembersAmount={groupMembersAmount}
            joinCommunityMutation={props.joinCommunityMutation}
            startPolling={startPolling}
            stopPolling={stopPolling}
          />
        );
      }}
    </Query>
  );
};

CommunityContainer.propTypes = {
  joinCommunityMutation: PropTypes.func,
};

export default compose(
  graphql(JOIN_COMMUNITY_MUTATION, { name: 'joinCommunityMutation' }),
)(CommunityContainer);
