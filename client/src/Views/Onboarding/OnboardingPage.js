import React from 'react';
import PropTypes from 'prop-types';

import 'src/App.css';
import 'src/utils.css';
import './OnboardingPage.css';

import MatchmakingScreen from './components/MatchmakingScreen/MatchmakingScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';

import { ReactComponent as HavenLogo } from './images/haven-logo-small.svg';
import { ReactComponent as ArrowLeft } from './images/arrow-left.svg';

export default class OnboardingPage extends React.Component {
  state = {
    step: this.props.groupMembersAmount ? 3 : 1,
    image: null,
    imageUrl: '',
    position: '',
    preferences: {},
    isLocationPreferred: '',
    city: '',
    country: '',
    bio: '',
    interests: '',
  };

  goToNextStep = () => {
    this.setState(prevState => {
      return {
        step: prevState.step + 1,
      };
    });
  };

  goToPrevStep = () => {
    this.setState(prevState => {
      return {
        step: prevState.step - 1,
      };
    });
  };

  onUploadImage = files => {
    const image = files[0];
    this.setState({ image, imageUrl: URL.createObjectURL(image) });
  };

  createProfile = async () => {
    const { position, bio, interests, city, country } = this.state;
    await this.props.createProfileMutation({
      variables: {
        position,
        bio,
        interests,
        city,
        country,
      },
    });

    this.setState(prevState => {
      return {
        step: prevState.step + 1,
      };
    });
  };

  onInputChange = (inputType, value) => {
    this.setState({ [inputType]: value });
  };

  render() {
    return (
      <div className="onboarding-page-container">
        {this.state.step < 3 ? (
          <>
            <div className="haven-logo text-align--center spacing-top--lg spacing-bottom--md">
              <HavenLogo />
            </div>
            <div
              className={
                this.state.step > 1
                  ? 'step-counter--with-back-button step-counter-wrapper spacing-bottom--md'
                  : 'step-counter-wrapper spacing-bottom--md'
              }
            >
              <div className="arrow-left" onClick={this.goToPrevStep}>
                <ArrowLeft />
              </div>
              <h1 className="step-counter heading--md">
                Step {this.state.step} of 2
              </h1>
            </div>
            {this.state.step === 1 && (
              <MatchmakingScreen
                goToNextStep={this.goToNextStep}
                onInputChange={this.onInputChange}
                position={this.state.position}
                preferences={this.state.preferences}
                isLocationPreferred={this.state.isLocationPreferred}
                city={this.state.city}
                country={this.state.country}
              />
            )}
            {this.state.step === 2 && (
              <ProfileScreen
                onSubmit={this.createProfile}
                onInputChange={this.onInputChange}
                onUploadImage={this.onUploadImage}
                bio={this.state.bio}
                interests={this.state.interests}
                imageUrl={this.state.imageUrl}
                goToPrevStep={this.goToPrevStep}
              />
            )}
          </>
        ) : (
          <WaitingScreen
            firstName={this.props.firstName}
            goToNextStep={this.goToNextStep}
            isWaiting={this.state.step === 3}
            startPolling={this.props.startPolling}
            stopPolling={this.props.stopPolling}
            groupMembersAmount={this.props.groupMembersAmount}
            goToApp={this.props.goToApp}
          />
        )}
      </div>
    );
  }
}

OnboardingPage.propTypes = {
  firstName: PropTypes.string,
  createProfileMutation: PropTypes.func,
  goToApp: PropTypes.func,
  initialStep: PropTypes.number,
  startPolling: PropTypes.func,
  stopPolling: PropTypes.func,
  groupMembersAmount: PropTypes.number,
};
