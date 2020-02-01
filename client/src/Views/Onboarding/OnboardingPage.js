import React from 'react';
import MatchmakingScreen from './components/MatchmakingScreen/MatchmakingScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';

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
    if (this.state.step === 1) {
      return <MatchmakingScreen goToNextStep={this.goToNextStep} />;
    } else if (this.state.step === 2) {
      return (
        <ProfileScreen
          goToNextStep={this.goToNextStep}
          goToPrevStep={this.goToPrevStep}
        />
      );
    }
    return <WaitingScreen />;
  }
}
