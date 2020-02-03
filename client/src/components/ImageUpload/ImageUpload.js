import React from 'react';
import './ImageUpload.css';
import Img from 'react-fix-image-orientation';

import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { ReactComponent as PlusIcon } from 'src/components/ImageUpload/images/plus-large.svg';

export default class ImageUpload extends React.Component {
  render() {
    const { imageUrl } = this.props;

    return (
      <Dropzone
        className="onboarding-dropzone"
        onDrop={this.props.onUpload}
        accept="image/*"
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div className={
              imageUrl ?
              "onboarding-dropzone" :
              "onboarding-dropzone onboarding-dropzone--no-image"
            } {...getRootProps()}>
              <input {...getInputProps()} />
              {imageUrl ? (
                <Img className="plsFit" src={imageUrl} />
              ) : (
                <PlusIcon/>
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
