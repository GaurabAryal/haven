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
      isDm
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

    typing(groupId: $groupId) {
      chatroom
      author
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

const TYPING_SUBSCRIPTION = gql`
subscription NewTypingSubscription($groupId: String!) {
  onNewTypingMessage(chatroom: $groupId) {
    author
    chatroom
  }
}
`

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

const SEND_TYPING_MUTATION = gql`
  mutation sendTypingMessage($author: String, $chatroom: String) {
    sendTypingMessage(author: $author, chatroom: $chatroom) {
      ok
    }
  }
`

const CREATE_PRIVATE_CHAT_MUTATION = gql`
  mutation createPrivateChat(
    $otherUser: String!
    $selfUser: String!
  ) {
    createPrivateChat(otherUser: $otherUser, selfUser: $selfUser) {
      group {
        id
      }
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
      {({ loading, error, data, subscribeToMore, refetch }) => {
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

        const typingMore = () =>
          subscribeToMore({
            document: TYPING_SUBSCRIPTION,
            variables: { groupId },
            updateQuery: (prev, { subscriptionData }) => {
              console.log('hellooo');
              if (!subscriptionData.data) return prev;
              return Object.assign({}, prev, {
                typing: subscriptionData.data.onNewTypingMessage,
              });
            },
          });

        return (
          <ChatScreen
            members={data.group.members}
            chatHistory={data.history}
            meId={data.me.id}
            meImageUrl={data.me.profile.profilePicture}
            meIsVerified={data.me.profile.isVerified}
            meStatus={data.me.profile.status}
            groupId={groupId}
            createMessageMutation={props.createMessageMutation}
            verifyUserMutation={props.verifyUserMutation}
            saveMessageMutation={props.saveMessageMutation}
            sendTypingMutation={props.sendTypingMutation}
            createPrivateChatMutation={
              props.createPrivateChatMutation
            }
            subscribeToMore={more}
            typingSubscribeToMore={typingMore}
            typing={data.typing}
            savedMessages={data.savedMessages}
            refetch={refetch}
            mainPageRefetch={props.mainPageRefetch}
            isDirectMessage={data.group.isDm}
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
  createPrivateChatMutation: PropTypes.func,
  sendTypingMutation: PropTypes.func,
};

export default compose(
  graphql(CREATE_MESSAGE_MUTATION, { name: 'createMessageMutation' }),
  graphql(VERIFY_USER_MUTATION, { name: 'verifyUserMutation' }),
  graphql(EDIT_PROFILE_MUTATION, { name: 'editProfileMutation' }),
  graphql(SAVE_MESSAGE_MUTATION, { name: 'saveMessageMutation' }),
  graphql(SEND_TYPING_MUTATION, { name: 'sendTypingMutation' }),
  graphql(CREATE_PRIVATE_CHAT_MUTATION, {
    name: 'createPrivateChatMutation',
  }),
)(ChatContainer);
