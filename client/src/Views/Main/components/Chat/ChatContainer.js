import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from '@apollo/react-components';
import { graphql } from '@apollo/react-hoc';
import { compose } from 'recompose';

import ChatScreen from './ChatScreen.js';

const CHAT_QUERY = gql`
  query Chat($groupId: String!) {
    group(groupId: $groupId) {
      members {
        id
        firstName
        lastName
      }
    }

    history(chatroom: $groupId) {
      author
      text
    }

    me {
      id
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription ChatSubscription($groupId: String!) {
    onNewChatMessage(chatroom: $groupId) {
      author
      text
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation sendChatMessage(
    $chatroom: String!
    $text: String
    $author: String!
  ) {
    sendChatMessage(
      chatroom: $chatroom
      text: $text
      author: $author
    ) {
      ok
    }
  }
`;

const ChatContainer = props => {
  const groupId = props.match.params.id;
  return (
    <Query query={CHAT_QUERY} variables={{ groupId }}>
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <div />;
        if (error) return `Error! ${error.message}`;

        const more = () =>
          subscribeToMore({
            document: SUBSCRIPTION,
            variables: { groupId },
            updateQuery: (prev, { subscriptionData }) => {
              if (!subscriptionData.data) return prev;
              const node = subscriptionData.data.onNewChatMessage;
              return Object.assign({}, prev, {
                history: [...prev.history, node].slice(-20),
              });
            },
          });

        return (
          <ChatScreen
            members={data.group.members}
            history={data.history.slice(-20)}
            meId={data.me.id}
            groupId={groupId}
            createMessageMutation={props.createMessageMutation}
            subscribeToMore={more}
          />
        );
      }}
    </Query>
  );
};

ChatContainer.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  createMessageMutation: PropTypes.func,
};

export default compose(
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' }),
)(ChatContainer);