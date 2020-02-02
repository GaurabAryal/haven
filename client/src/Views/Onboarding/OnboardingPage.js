import React from 'react';

import MatchmakingScreen from './components/MatchmakingScreen/MatchmakingScreen';
import ProfileScreen from './components/ProfileScreen/ProfileScreen';
import WaitingScreen from './components/WaitingScreen/WaitingScreen';

export default class OnboardingContainer extends React.Component {
  state = {
    step: 2,
    image: null,
    imageUrl: '',
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
    if (this.state.step === 1) {
      return <MatchmakingScreen goToNextStep={this.goToNextStep} />;
    } else if (this.state.step === 2) {
      return (
        <ProfileScreen
          onSubmit={this.onSubmit}
          onInputChange={this.onInputChange}
          onUploadImage={this.onUploadImage}
          imageUrl={this.state.imageUrl}
          goToPrevStep={this.goToPrevStep}
        />
      );
    }
    return <WaitingScreen />;
  }
}
