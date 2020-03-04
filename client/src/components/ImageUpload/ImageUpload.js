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
        onDrop={this.props.onUpload}
        accept="image/*"
        multiple={false}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className={
              imageUrl
                ? 'imageUpload-dropzone'
                : 'imageUpload-dropzone imageUpload-dropzone--no-image'
            }
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            {imageUrl ? (
              <Img className="imageUpload-image" src={imageUrl} />
            ) : (
              <PlusIcon />
            )}
          </div>
        )}
      </Dropzone>
    );
  }
}

ImageUpload.propTypes = {
  onUpload: PropTypes.func,
  imageUrl: PropTypes.string,
  fullWidth: PropTypes.bool,
};
