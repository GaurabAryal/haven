import React from 'react';

export default class OnboardingContainer extends React.Component {
  state = {
    step: 1,
    matchmakingData: {},
    profileData: {},
  };

  goToNextStep = () => {
    this.setState(prevState => {
      return {
        step: prevState.step++,
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
    return <div />;
  }
}
