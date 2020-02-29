import React from 'react';
import PropTypes from 'prop-types';

import ChatHeader from './ChatHeader';
import ContentContainer from '../ContentContainer/ContentContainer';
import ChatMessage from 'src/components/ChatMessage/ChatMessage';
import Button from 'src/components/Button/Button';
import './Chat.css';

export default class ChatScreen extends React.Component {
  state = { message: '' };

  scrollToBottom = (smooth = false) => {
    this.messagesEnd.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
  };

  componentDidMount() {
    this.scrollToBottom();
    this.props.subscribeToMore();
  }

  onSubmit = async event => {
    event.preventDefault();
    this.scrollToBottom(true);

    if (!this.state.message) {
      return;
    }

    await this.props.createMessageMutation({
      variables: {
        chatroom: this.props.groupId,
        text: this.state.message,
        author: this.props.meId,
      },
    });

    this.setState({ message: '' });
  };

  getName(id) {
    const member = this.props.members.find(
      member => id === member.id,
    );

    return `${member.firstName} ${member.lastName}`;
  }

  render() {
    const { history, meId, members } = this.props;
    return (
      <ContentContainer header={<ChatHeader members={members} />}>
        <div className="chatContainer">
          <div className="messageContainer">
            {history.map((message, index) => (
              <ChatMessage
                key={`message ${index}`}
                sender={this.getName(message.author)}
                message={message.text}
                isSelf={message.author === meId}
              />
            ))}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            ></div>
          </div>
          <form onSubmit={this.onSubmit} className="message-input">
            <input
              type="text"
              placeholder="Type a message"
              value={this.state.message}
              onChange={e =>
                this.setState({ message: e.target.value })
              }
            />
            <Button variant="primary" onClick={this.onSubmit}>
              Submit
            </Button>
          </form>
        </div>
      </ContentContainer>
    );
  }
}

ChatScreen.propTypes = {
  members: PropTypes.array,
  subscribeToMore: PropTypes.func,
  meId: PropTypes.string,
  groupId: PropTypes.string,
  createMessageMutation: PropTypes.func,
  history: PropTypes.array,
};
