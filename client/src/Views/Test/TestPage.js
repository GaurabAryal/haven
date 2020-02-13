import React from 'react';
import 'src/App.css';
import ChatMessage from 'src/components/ChatMessage/ChatMessage';

export default class TestPage extends React.Component {
  state = {};

  render() {
    return (
      <div>
        <ChatMessage
          sender="Amy Hartworth"
          message="How's everyone's day going?"
          time="5 min ago"
          isSelf={false}
        />
        <ChatMessage
          sender="James Kim"
          message="I'm good! Having a coffee and meeting up with Ponnu"
          time="just now"
          isSelf={true}
        />
      </div>
    );
  }
}

TestPage.propTypes = {};
