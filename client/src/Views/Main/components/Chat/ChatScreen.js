import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ChatHeader from './ChatHeader';
import ChatDetails from './ChatDetails';
import ContentContainer from '../ContentContainer/ContentContainer';
import ChatMessage from 'src/components/ChatMessage/ChatMessage';
import Modal from 'src/components/Modal/Modal';
import Button from 'src/components/Button/Button';
import VerifyModal from './components/VerifyModal/VerifyModal';
import ReportModal from './components/ReportModal/ReportModal';
import { ReactComponent as CloseIcon } from 'src/components/Modal/images/X.svg';
import { toast } from 'react-toastify';

import { getMemberColor } from 'src/utils';
import './Chat.css';

export default class ChatScreen extends React.Component {
  state = {
    message: '',
    showDetails:
      localStorage.getItem('haven_sidebar') === 'true' ? true : false,
    showIntroMessage:
      localStorage.getItem(
        `haven_showintro_userId${this.props.meId}_groupId${this.props.groupId}`,
      ) === 'false'
        ? false
        : true,
    showGuidelines: false,
    showVerifyModal: false,
    showReportModal: false,
    reportedUserId: '',
    userIdToView: '',
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

  componentDidUpdate(prevProps) {
    if (this.props.groupId !== prevProps.groupId) {
      this.setState({
        showIntroMessage:
          localStorage.getItem(
            `haven_showintro_userId${this.props.meId}_groupId${this.props.groupId}`,
          ) === 'false'
            ? false
            : true,
      });
    }
  }

  onSubmit = async event => {
    event.preventDefault();
    this.scrollToBottom(true);
    const containsUrl = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
    ).test(this.state.message);
    const containsPhoneNum = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/gim.test(
      this.state.message,
    );
    const containsEmail = /[\w-]+@([\w-]+\.)+[\w-]+/.test(
      this.state.message,
    );

    if (!this.state.message) {
      return;
    }

    if (
      !this.props.meIsVerified &&
      (containsUrl || containsPhoneNum || containsEmail)
    ) {
      if (containsUrl) {
        toast('To send links and more, verify your account under details');
      } else if (containsPhoneNum) {
        toast(
          'To send phone numbers and more, verify your account under details',
        );
      } else if (containsEmail) {
        toast(
          'To send email addresses and more, verify your account under details',
        );
      }
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

  onCloseIntroMessage = () => {
    this.setState({ showIntroMessage: false });
    localStorage.setItem(
      `haven_showintro_userId${this.props.meId}_groupId${this.props.groupId}`,
      false,
    );
  };

  onUseIntroMessage = () => {
    let inputField = document.getElementById('message-composer');
    this.onCloseIntroMessage();
    this.setState({ message: this.getIntroMessage() });
    inputField.style.height = '86px';
    inputField.focus();
  };

  getIntroMessage() {
    let intro = '';
    const meId = this.props.meId;
    const position = this.getSender(meId).profile.position;
    const interests = this.getSender(meId).profile.interests;
    const firstName = this.getSender(meId).firstName;
    if (position === 'other' || position === 'unknown') {
      if (interests) {
        return `Hi I'm ${firstName} and I'm interested in ${interests.toLowerCase()}`;
      } else {
        return null;
      }
    } else if (position === 'professional') {
      intro = `Hi I'm ${firstName}! I'm a professional caregiver`;
      if (interests)
        intro += ` and am interested in ${interests.toLowerCase()}`;
      return intro;
    } else {
      intro = `Hi I'm ${firstName}! I'm a ${position} of a person with dementia`;
      if (interests)
        intro += ` and am interested in ${interests.toLowerCase()}`;
      return intro;
    }
  }

  getSender(id) {
    return this.props.members.find(member => id === member.id);
  }

  onSaveMessage = async (chatId, isSave) => {
    if (isSave) {
      await this.props.saveMessageMutation({
        variables: { chatId, groupId: this.props.groupId },
      });
      this.props.refetch();
    } else {
      console.log('unsave this message!');
    }
  };

  onDirectMessage = userId => {
    if (!this.props.meIsVerified) {
      toast('To start one-on-one (direct) messages, both users must be verified. Verify your account under details!');
    }
    console.log('one on one message with' + userId);
  };

  getGuidelines() {
    return [
      'This is a closed community, so your activity will only be seen by your community members',
      'Be kind, polite, and courteous',
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

  verifyUser = async () => {
    await this.props.verifyUserMutation({
      variables: { userId: this.props.meId },
    });
    this.props.refetch();
    toast('You are now a verified member!');
  };

  viewUserProfile = id => {
    localStorage.setItem('haven_sidebar', true);
    this.setState({ showDetails: true, userIdToView: id });
  };

  clearUserIdToView = () => {
    this.setState({ userIdToView: '' });
  };

  render() {
    const { history, meId, members } = this.props;
    return (
      <ContentContainer
        header={
          <ChatHeader
            members={members}
            isDetailsOpen={this.state.showDetails}
            toggleDetails={() => {
              this.setState(prevState => ({
                showDetails: !prevState.showDetails,
              }));
              localStorage.setItem(
                'haven_sidebar',
                !this.state.showDetails,
              );
            }}
            showGuidelines={() =>
              this.setState({ showGuidelines: true })
            }
          />
        }
        details={
          <ChatDetails
            members={members}
            meId={meId}
            meImageUrl={this.props.meImageUrl}
            meIsVerified={this.props.meIsVerified}
            openVerifyModal={() =>
              this.setState({ showVerifyModal: true })
            }
            userIdToView={this.state.userIdToView}
            clearUserIdToView={() => this.clearUserIdToView()}
            savedMessages={this.props.savedMessages}
            onDirectMessage={this.onDirectMessage}
          />
        }
        showDetails={this.state.showDetails}
      >
        <>
          {!history.length ? (
            <div className="no-messages-placeholder-container">
              <div className="no-messages-placeholder text--lg color--grey-light">
                No one has started a conversation yet
              </div>
            </div>
          ) : null}
          <div className="chatContainer">
            <div className="messageContainer">
              {history.map((message, index) => {
                const isMessageSaved = this.props.savedMessages.find(
                  savedMessage => savedMessage.id === message.chatId,
                );
                return (
                  <ChatMessage
                    key={`message ${index}`}
                    sender={this.getSender(message.author)}
                    message={message}
                    isSelf={message.author === meId}
                    isMessageSaved={Boolean(isMessageSaved)}
                    time="just now"
                    backgroundColor={getMemberColor(
                      message.author,
                      members,
                    )}
                    onReportUser={reportedUserId => {
                      this.setState({
                        showReportModal: true,
                        reportedUserId,
                      });
                    }}
                    onViewUserProfile={this.viewUserProfile}
                    onSaveMessage={this.onSaveMessage}
                    onDirectMessage={this.onDirectMessage}
                    meIsVerified={this.props.meIsVerified}
                  />
                );
              })}
              <div
                ref={el => {
                  this.messagesEnd = el;
                }}
              />
            </div>
            <form
              onSubmit={this.onSubmit}
              className={
                this.state.showDetails
                  ? 'message-composer message-composer--small-width'
                  : 'message-composer message-composer--full-width'
              }
            >
              {this.state.showIntroMessage && this.getIntroMessage() && (
                <div className="message-composer__intro-message">
                  <CloseIcon
                    className="close-btn"
                    onClick={this.onCloseIntroMessage}
                  />
                  <p className="text--md font-weight--bold spacing-bottom--xs">
                    Introduce yourself to the group
                  </p>
                  <p className="text--md spacing-bottom--sm">
                    {this.getIntroMessage()}
                  </p>
                  <Button
                    variant="primary"
                    onClick={this.onUseIntroMessage}
                  >
                    Use and edit
                  </Button>
                </div>
              )}
              <textarea
                id="message-composer"
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
            <VerifyModal
              isOpen={this.state.showVerifyModal}
              onClose={() =>
                this.setState({ showVerifyModal: false })
              }
              onVerify={this.verifyUser}
            />
            <ReportModal
              isOpen={this.state.showReportModal}
              onClose={() =>
                this.setState({ showReportModal: false })
              }
              onReport={id => console.log('reported', id)}
              userId={this.state.reportedUserId}
            />
          </div>
        </>
      </ContentContainer>
    );
  }
}

ChatScreen.propTypes = {
  members: PropTypes.array,
  subscribeToMore: PropTypes.func,
  meId: PropTypes.string,
  meImageUrl: PropTypes.string,
  meIsVerified: PropTypes.bool,
  meStatus: PropTypes.string,
  groupId: PropTypes.string,
  createMessageMutation: PropTypes.func,
  verifyUserMutation: PropTypes.func,
  saveMessageMutation: PropTypes.func,
  history: PropTypes.array,
  verifyUser: PropTypes.func,
  savedMessages: PropTypes.array,
  refetch: PropTypes.func,
};
