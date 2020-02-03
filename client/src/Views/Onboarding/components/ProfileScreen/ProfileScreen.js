import React from 'react';
import './ProfileScreen.css';
import PropTypes from 'prop-types';

import OnboardingRow from '../OnboardingRow/OnboardingRow';
import ImageUpload from 'src/components/ImageUpload/ImageUpload';
import Button from 'src/components/Button/Button';

export default function ProfileScreen(props) {
  return (
    <>
      <div>Almost done!</div>
      <div>
        Introduce yourself with a short bio and add a profile picture
        to get started
      </div>
      <OnboardingRow label="Describe yourself">
        <textarea
          value={props.bio}
          onChange={e => props.onInputChange('bio', e.target.value)}
        />
      </OnboardingRow>
      <OnboardingRow label="What are your interests and hobbies?">
        <textarea
          value={props.interests}
          onChange={e =>
            props.onInputChange('interests', e.target.value)
          }
        />
      </OnboardingRow>
      <OnboardingRow label="Profile picture">
        <ImageUpload
          onUpload={props.onUploadImage}
          imageUrl={props.imageUrl}
        />
      </OnboardingRow>
      <Button
        variant="primary"
        isFullWidth={true}
        onClick={props.onSubmit}
      >
        Get started
      </Button>
    </>
  );
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
