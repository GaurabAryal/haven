import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'src/components/Modal/Modal';
import ImageUpload from 'src/components/ImageUpload/ImageUpload';

import './VerifyModal.css';

export default class VerifyModal extends React.Component {
  state = { step: 1, image: null, imageUrl: '', error: '' };

  onSubmit = async () => {
    if (this.state.imageUrl) {
      await this.props.onVerify();
      this.setState({ step: 2 });
    } else {
      this.setState({ error: 'Please upload your ID.' });
    }
  };

  onUploadImage = files => {
    const image = files[0];
    this.setState({
      image,
      imageUrl: URL.createObjectURL(image),
      error: '',
    });
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.props.isOpen && this.state.step === 1}
          onClose={this.props.onClose}
          buttonText="Submit"
          disableButton={Boolean(this.state.error)}
          onButtonClick={this.onSubmit}
          header="Verify account"
          width="600px"
          height="600px"
        >
          <div style={{position: "relative"}}>
            <div className="spacing-bottom--md">
              To start one-on-one (direct) messages you need to be
              verified. Verify your account by uploading a valid photo
              ID (Driver’s license, passport, health card, etc.).
              Please upload a photo ID below.
            </div>
            <div className="verifyModal-imageUpload">
              <ImageUpload
                onUpload={this.onUploadImage}
                imageUrl={this.state.imageUrl}
                fullWidth
              />
            </div>
            <p className="error-message--relative spacing-top--md">{this.state.error}</p>
          </div>
        </Modal>
        <Modal
          isOpen={this.props.isOpen && this.state.step === 2}
          onClose={this.props.onClose}
          buttonText="Got it!"
          onButtonClick={this.props.onClose}
          header="Verify account"
          width="600px"
          height="380px"
        >
          <div>
            <p className="spacing-bottom--lg">
              We have received you verification request. We will
              notify you as soon as possible via email.
            </p>
            <div className="loadingspinner" />
          </div>
        </Modal>
      </>
    );
  }
}

VerifyModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onVerify: PropTypes.func,
};
