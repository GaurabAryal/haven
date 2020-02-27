import React from 'react';
import PropTypes from 'prop-types';

import ChatHeader from './ChatHeader';
import ContentContainer from '../ContentContainer/ContentContainer';

const MessageItem = ({ message }) => (
  <div>
    <p>
      {message.author}: {message.text}
    </p>
  </div>
);

class MessageListView extends React.PureComponent {
  componentDidMount() {
    this.props.subscribeToMore();
  }
  render() {
    const { history } = this.props;
    return (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {history.map(message => (
          <MessageItem message={message} />
        ))}
      </ul>
    );
  }
}

export default class ChatScreen extends React.Component {
  state = { message: '' };

  onSubmit = async () => {
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

  render() {
    return (
      <ContentContainer
        header={<ChatHeader members={this.props.members} />}
      >
        <MessageListView
          history={this.props.history}
          subscribeToMore={this.props.subscribeToMore}
        />
        <div className="textField">
          <input
            type="text"
            placeholder="Type a message"
            value={this.state.message}
            onChange={e => this.setState({ message: e.target.value })}
          />
          <button onClick={this.onSubmit}>Submit</button>
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
  history: PropTypes.object,
};
