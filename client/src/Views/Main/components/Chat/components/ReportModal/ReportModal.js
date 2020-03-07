import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'src/components/Modal/Modal';
import FormRow from 'src/components/FormRow/FormRow';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';
import TextArea from 'src/components/TextArea/TextArea';

import { REPORT_REASONS } from 'src/constants';

export default class ReportModal extends React.Component {
  state = { reasons: {}, details: '', error: '' };
  timer = null;

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  onSubmit = async () => {
    const reasons = Object.keys(this.state.reasons);
    if (reasons.length && this.state.details) {
      await this.props.onReport(this.props.userId);
      this.props.onClose();
    } else {
      this.setState({ error: 'Please fill in all fields.' });
    }
  };

  onSelect(option) {
    const reasons = { ...this.state.reasons };
    if (reasons[option]) {
      reasons[option] = false;
    } else {
      reasons[option] = true;
    }
    this.setState({ reasons, error: '' });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        buttonText="Submit report"
        disableButton={Boolean(this.state.error)}
        onButtonClick={this.onSubmit}
        header="Report"
        width="600px"
        height="600px"
      >
        <div style={{ position: 'relative' }}>
          <FormRow
            label="Please select issues that apply"
            noTopSpacing
          >
            <SelectableContainer
              multiselect
              value={this.state.reasons}
              options={REPORT_REASONS}
              onSelect={option => this.onSelect(option)}
            />
          </FormRow>
          <FormRow label="Add note or more details" halfTopSpacing>
            <TextArea
              value={this.state.details}
              onChange={e =>
                this.setState({ details: e.target.value, error: '' })
              }
            />
          </FormRow>
          <p className="error-message--relative spacing-top--md">
            {this.state.error}
          </p>
        </div>
      </Modal>
    );
  }
}

ReportModal.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onReport: PropTypes.func,
  userId: PropTypes.string,
};
