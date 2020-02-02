import React from 'react';
import 'src/App.css'
import 'src/utils.css'
import MatchmakingScreen from './components/MatchmakingScreen/MatchmakingScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';
import './OnboardingPage.css';
import { ReactComponent as HavenLogo } from './images/haven-logo-small.svg';

export default class OnboardingContainer extends React.Component {
  state = {
    step: 1,
    matchmakingData: {},
    profileData: {},
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
        step: prevState.step--,
      };
    });
  };

  render() {
    return (
      <div className="onboarding-page-container">
        <div className="haven-logo text-align--center spacing-top--lg spacing-bottom--md">
          <HavenLogo/>
        </div>
        <h1 className="heading--md spacing-bottom--md">Step {this.state.step} of 2</h1>
        {
          this.state.step === 1 &&
          <MatchmakingScreen goToNextStep={this.goToNextStep} />
        }
        {
          this.state.step === 2 &&
          <ProfileScreen
            goToNextStep={this.goToNextStep}
            goToPrevStep={this.goToPrevStep}
          />
        }
        {
          (this.state.step !== 1 && this.state.step !== 2) &&
          <WaitingScreen />
        }
      </div>
    );
  }
}
