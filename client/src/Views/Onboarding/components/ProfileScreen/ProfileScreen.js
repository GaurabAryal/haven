import React from 'react';
import 'src/utils.css';
import './ProfileScreen.css';
import PropTypes from 'prop-types';

import FormRow from 'src/components/FormRow/FormRow';
import ImageUpload from 'src/components/ImageUpload/ImageUpload';
import TextArea from 'src/components/TextArea/TextArea';
import Button from 'src/components/Button/Button';

export default function ProfileScreen(props) {
  window.scrollTo(0, 0);
  return (
    <>
      <div>
        <h2 className="heading--lg font-weight--regular spacing-bottom--sm">
          Almost done!
        </h2>
        <p className="text--md font-weight--regular">
          Introduce yourself with a short bio and add a profile
          picture to get started. Don&apos;t worry, you can change
          these later!
        </p>
        <FormRow label="Describe yourself">
          <TextArea
            value={props.bio}
            initialRowHeight={3}
            placeholder="What makes you unique? What should people know about you?"
            onChange={e => props.onInputChange('bio', e.target.value)}
          />
        </FormRow>
        <FormRow label="What are your interests and hobbies?">
          <TextArea
            value={props.interests}
            initialRowHeight={1}
            placeholder="e.g. jazz, fashion, cooking"
            onChange={e =>
              props.onInputChange('interests', e.target.value)
            }
          />
        </FormRow>
        <FormRow label="Add a profile picture">
          <div className="profileScreen-imageUpload">
            <ImageUpload
              onUpload={props.onUploadImage}
              imageUrl={props.imageUrl}
            />
          </div>
        </FormRow>
        <div className="button-wrapper spacing-top--lg spacing-bottom--md">
          <Button
            variant="primary"
            isFullWidth={true}
            onClick={props.onSubmit}
            className="test"
          >
            Get started
          </Button>
        </div>
      </div>
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
