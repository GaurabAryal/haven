import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ChatHeader from './ChatHeader';
import ChatDetails from './ChatDetails';
import ContentContainer from '../ContentContainer/ContentContainer';
import ChatMessage from 'src/components/ChatMessage/ChatMessage';
import Modal from 'src/components/Modal/Modal';
import Button from 'src/components/Button/Button';
import { getMemberColor } from 'src/utils';
import './Chat.css';

export default class ChatScreen extends React.Component {
  state = {
    message: '',
    showDetails: localStorage.getItem('haven_sidebar') === 'true' ? true : false,
    showGuidelines: false
  };

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
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
      },
    });

    this.setState({ message: '' });
  };

  onCloseGuidelines = () => this.setState({ showGuidelines: false });

  getName(id) {
    const member = this.props.members.find(
      member => id === member.id,
    );

    return `${member.firstName} ${member.lastName}`;
  }

  getGuidelines() {
    return [
      'This is a closed community, so your activity will only be seen by your community members',
      'Be kind, polite, and corteous',
      'No hate speech or bullying',
      'No inappropriate and vulgar language',
      "Respect everyone's privacy",
      'No debating religion or political beliefs',
      'Report any violation',
      'Members not complying with the community guidlines may be banned',
    ].map((guideline, index) => (
      <p key={'guideline' + index} className="spacing-bottom--sm">
        {index + 1}. {guideline}
      </p>
    ));
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
            toggleDetails={() => {
                this.setState(prevState => ({
                  showDetails: !prevState.showDetails,
                }));
                localStorage.setItem('haven_sidebar', !this.state.showDetails)
              }
            }
            showGuidelines={() =>
              this.setState({ showGuidelines: true })
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
                backgroundColor={getMemberColor(message.author, members)}
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
          <Modal
            isOpen={this.state.showGuidelines}
            onClose={this.onCloseGuidelines}
            buttonText="Got it!"
            header="Community guidelines"
            onButtonClick={this.onCloseGuidelines}
            width="600px"
            height="480px"
          >
            <>{this.getGuidelines()}</>
          </Modal>
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
