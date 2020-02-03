import React from 'react';
import 'src/App.css';
import 'src/utils.css';
import MatchmakingScreen from './components/MatchmakingScreen/MatchmakingScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';
import './OnboardingPage.css';
import { ReactComponent as HavenLogo } from './images/haven-logo-small.svg';
import { ReactComponent as ArrowLeft } from './images/arrow-left.svg';

export default class OnboardingContainer extends React.Component {
  state = {
    step: 1,
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

  onSubmit = () => {
    this.goToNextStep();
  };

  onInputChange = (inputType, value) => {
    this.setState({ [inputType]: value });
  };

  render() {
    return (
      <div className="onboarding-page-container">
        <div className="haven-logo text-align--center spacing-top--lg spacing-bottom--md">
          <HavenLogo />
        </div>
        <div className={
          this.state.step > 1 ?
          "step-counter--with-back-button step-counter-wrapper spacing-bottom--md" :
          "step-counter-wrapper spacing-bottom--md"
        }>
          <div className="arrow-left" onClick={this.goToPrevStep}>
            <ArrowLeft/>
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
            onSubmit={this.onSubmit}
            onInputChange={this.onInputChange}
            onUploadImage={this.onUploadImage}
            imageUrl={this.state.imageUrl}
            goToPrevStep={this.goToPrevStep}
          />
        )}
        {this.state.step !== 1 && this.state.step !== 2 && (
          <WaitingScreen />
        )}
      </div>
    );
  }
}
