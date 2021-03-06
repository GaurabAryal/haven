import React from 'react';
import PropTypes from 'prop-types';
import './WaitingScreen.css';
import { MIN_GROUP_SIZE } from 'src/constants';

export default class WaitingScreen extends React.Component {
  startTimer = null;
  endTimer = null;

  componentDidMount() {
    if (this.props.isWaiting) {
      this.startTimer = setTimeout(() => {
        this.props.startPolling(1000);
      }, 3000);
      this.endTimer = setTimeout(() => {
        this.props.stopPolling();
        this.props.goToNextStep();
      }, 10000);
    }
  }

  componentDidUpdate() {
    if (this.props.groupMembersAmount >= MIN_GROUP_SIZE) {
      this.props.goToApp();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.startTimer);
    clearTimeout(this.endTimer);
  }

  render() {
    const { isWaiting } = this.props;
    const bodyText = isWaiting
      ? "We're currently looking for the perfect group match for you. Please wait a few seconds."
      : "We can't find you a group right now. We'll keep searching and notify you once you've been added to it.";

    return (
      <div className="waiting-container">
        <h2 className="text--xl font-weight--regular spacing-bottom--md">
          One moment {this.props.firstName}!
        </h2>
        <p className="text--md spacing-bottom--lg">{bodyText}</p>
        {isWaiting && <div className="loadingspinner" />}
      </div>
    );
  }
}

WaitingScreen.propTypes = {
  firstName: PropTypes.string,
  isWaiting: PropTypes.bool,
  goToNextStep: PropTypes.func,
  startPolling: PropTypes.func,
  stopPolling: PropTypes.func,
  groupMembersAmount: PropTypes.number,
  goToApp: PropTypes.func,
};
