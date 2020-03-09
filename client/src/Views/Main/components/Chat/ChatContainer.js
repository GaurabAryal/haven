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
        dateJoined
        profile {
          id
          position
          bio
          interests
          profilePicture
          isVerified
        }
      }
    }

    savedMessages(groupId: $groupId) {
      id
      message
      chatTime
      user {
        id
        firstName
        lastName
      }
    }

    history(chatroom: $groupId) {
      author
      text
      chatId
    }

    me {
      id
      profile {
        id
        profilePicture
        isVerified
        status
      }
    }
  }
`;

const SUBSCRIPTION = gql`
  subscription ChatSubscription($groupId: String!) {
    onNewChatMessage(chatroom: $groupId) {
      author
      text
      chatId
    }
  }
`;

const CREATE_MESSAGE_MUTATION = gql`
  mutation sendChatMessage(
    $chatroom: String!
    $text: String
    $author: String!
    $date: String!
  ) {
    sendChatMessage(
      chatroom: $chatroom
      text: $text
      author: $author
      date: $date
    ) {
      ok
    }
  }
`;

const SAVE_MESSAGE_MUTATION = gql`
  mutation saveChatMessage($groupId: String!, $chatId: String!) {
    saveMessage(groupId: $groupId, chatId: $chatId) {
      chat {
        id
      }
    }
  }
`;

const VERIFY_USER_MUTATION = gql`
  mutation verifyUser($userId: String!) {
    verifyUser(userId: $userId) {
      profile {
        id
      }
    }
  }
`;

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($status: String) {
    updateProfile(profileInput: { status: $status }) {
      profile {
        id
        status
      }
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
                history: [...prev.history, node],
              });
            },
          });

        return (
          <ChatScreen
            members={data.group.members}
            history={data.history}
            meId={data.me.id}
            meImageUrl={data.me.profile.profilePicture}
            meIsVerified={data.me.profile.isVerified}
            meStatus={data.me.profile.status}
            groupId={groupId}
            createMessageMutation={props.createMessageMutation}
            verifyUserMutation={props.verifyUserMutation}
            saveMessageMutation={props.saveMessageMutation}
            subscribeToMore={more}
            savedMessages={data.savedMessages}
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
  verifyUserMutation: PropTypes.func,
  saveMessageMutation: PropTypes.func,
};

export default compose(
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' }),
  graphql(VERIFY_USER_MUTATION, { name: 'verifyUserMutation' }),
  graphql(EDIT_PROFILE_MUTATION, { name: 'editProfileMutation' }),
  graphql(SAVE_MESSAGE_MUTATION, { name: 'saveMessageMutation' }),
)(ChatContainer);
