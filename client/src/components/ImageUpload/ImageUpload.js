import React from 'react';
import './ImageUpload.css';
import Img from 'react-fix-image-orientation';

import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

export default class ImageUpload extends React.Component {
  render() {
    const { imageUrl } = this.props;

    return (
      <Dropzone
        className="onboarding_Dropzone"
        onDrop={this.props.onUpload}
        accept="image/*"
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className="onboarding_Dropzone" {...getRootProps()}>
              <input {...getInputProps()} />
              {imageUrl ? (
                <Img className="plsFit" src={imageUrl} />
              ) : (
                <p>+</p>
              )}
            </div>
          </section>
        )}
      </Dropzone>
    );
  }
}

ImageUpload.propTypes = {
  onUpload: PropTypes.func,
  imageUrl: PropTypes.string,
};
