import React from 'react';
import './ProfileScreen.css';
import PropTypes from 'prop-types';

import OnboardingRow from '../OnboardingRow/OnboardingRow';
import ImageUpload from 'src/components/ImageUpload/ImageUpload';

export default class ProfileScreen extends React.Component {
  onBack = () => {
    this.props.goToPrevStep();
  };

  render() {
    return (
      <div>
        <div>Haven</div>
        <div>
          <button onClick={this.onBack}>BACK BUTTON THING</button>
          <div>Step 2 of 2</div>
        </div>
        <div>Almost done!</div>
        <div>
          Introduce yourself with a short bio and add a profile
          picture to get started
        </div>
        <OnboardingRow label="Describe yourself">
          <textarea
            value={this.props.bio}
            onChange={e =>
              this.props.onInputChange('bio', e.target.value)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="What are your interests and hobbies?">
          <textarea
            value={this.props.interests}
            onChange={e =>
              this.props.onInputChange('interests', e.target.value)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="Profile picture">
          <ImageUpload
            onUpload={this.props.onUploadImage}
            imageUrl={this.props.imageUrl}
          />
        </OnboardingRow>
        <button onClick={this.props.onSubmit} className="test">
          Get started
        </button>
      </div>
    );
  }
}

ProfileScreen.propTypes = {
  onSubmit: PropTypes.func,
  goToPrevStep: PropTypes.func,
  onInputChange: PropTypes.func,
  onUploadImage: PropTypes.func,
  imageUrl: PropTypes.string,
  bio: PropTypes.string,
  interests: PropTypes.string,
};
