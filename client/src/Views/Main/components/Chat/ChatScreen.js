import React from 'react';
import PropTypes from 'prop-types';

import ChatHeader from './ChatHeader';
import ChatDetails from './ChatDetails';
import ContentContainer from '../ContentContainer/ContentContainer';
import ChatMessage from 'src/components/ChatMessage/ChatMessage';
import Button from 'src/components/Button/Button';
import './Chat.css';

export default class ChatScreen extends React.Component {
  state = { message: '', showDetails: false };

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

  handleEnter(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      let inputField = e.target;
      inputField.style.height = 'auto';
      this.onSubmit(e);
      e.target.value = '';
    }
  }

  resizeInput(e) {
    let inputField = e.target;

    this.setState({
      message: e.target.value,
    });

    inputField.style.height = 'auto';
    inputField.style.height = inputField.scrollHeight + 'px';
  }

  render() {
    const { history, meId, members } = this.props;
    return (
      <ContentContainer
        header={
          <ChatHeader
            members={members}
            toggleDetails={() =>
              this.setState(prevState => ({
                showDetails: !prevState.showDetails,
              }))
            }
          />
        }
        details={
          <ChatDetails members={members} meId={this.props.meId} />
        }
        showDetails={this.state.showDetails}
      >
        <div className="chatContainer">
          <div className="messageContainer">
            {history.map((message, index) => (
              <ChatMessage
                key={`message ${index}`}
                sender={this.getName(message.author)}
                message={message.text}
                isSelf={message.author === meId}
                time="just now"
              />
            ))}
            <div
              ref={el => {
                this.messagesEnd = el;
              }}
            />
          </div>
          <form onSubmit={this.onSubmit} className={this.state.showDetails ? "message-composer message-composer--small-width" : "message-composer message-composer--full-width"}>
            <textarea
              className="message-composer__input"
              rows="1"
              type="text"
              placeholder="Type a message"
              value={this.state.message}
              onChange={e => this.resizeInput(e)}
              onKeyDown={e => this.handleEnter(e)}
            />
            <div className="message-input__button">
              <Button variant="primary" onClick={this.onSubmit}>
                Send
              </Button>
            </div>
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
