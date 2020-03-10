import React from 'react';
import PropTypes from 'prop-types';
import FormRow from 'src/components/FormRow/FormRow';
import Button from 'src/components/Button/Button';
import TextInput from 'src/components/TextInput/TextInput';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';
import Modal from 'src/components/Modal/Modal';

import { OPTIONS, QUESTION_OPTIONS } from 'src/constants';
import { getFilteredPreferencesOptions } from 'src/utils';

import 'src/utils.css';
import './MatchmakingScreen.css';

export default class MatchmakingScreen extends React.Component {
  state = {
    error: false,
    showExplanation: false,
  };

  isValidInputs() {
    const {
      position,
      preferences,
      isLocationPreferred,
      city,
      country,
    } = this.props;

    const preferenceValues = Object.values(preferences);

    const noPreferenceSelected =
      preferenceValues.every(preference => preference === false) ||
      !preferenceValues.length;

    const isFieldsFilled = Boolean(
      position &&
        this.props.isLocationPreferred &&
        !noPreferenceSelected,
    );
    const isLocationFilled = Boolean(city && country);

    return (
      isFieldsFilled &&
      ((isLocationPreferred === OPTIONS.isLocationPreferred.YES &&
        isLocationFilled) ||
        isLocationPreferred === OPTIONS.isLocationPreferred.NO)
    );
  }

  onShowExplanation = () => this.setState({ showExplanation: true });

  onCloseExplanation = () =>
    this.setState({ showExplanation: false });

  onContinue = () => {
    if (this.isValidInputs()) {
      if (
        this.props.position !== OPTIONS.position.PROFESSIONAL &&
        this.props.preferences[OPTIONS.preferences.GIVE_PROF]
      ) {
        const preferences = Object.assign(this.props.preferences, {});
        preferences[OPTIONS.preferences.GIVE_PROF] = false;
        this.props.onInputChange('preferences', preferences);
      }

      if (
        this.props.isLocationPreferred ===
          OPTIONS.isLocationPreferred.NO &&
        (this.props.city || this.props.country)
      ) {
        this.props.onInputChange('city', '');
        this.props.onInputChange('country', '');
      }

      this.props.goToNextStep();
    } else {
      this.setState({ error: true });
    }
  };

  onInputChange = (inputType, value) => {
    this.setState({ error: false });
    this.props.onInputChange(inputType, value);
  };

  onSelectSingle = (type, option) => {
    if (this.props[type] !== option) {
      this.onInputChange(type, option);
    } else {
      this.onInputChange(type, '');
    }
  };

  onSelectMultiple = (type, option) => {
    if (
      option === OPTIONS.preferences.ALL &&
      !this.props[type][OPTIONS.preferences.ALL]
    ) {
      this.onInputChange(type, { [OPTIONS.preferences.ALL]: true });
      return;
    }

    const selectedValues = Object.assign(this.props[type], {});

    // This series of if statements make sure someone can't seek and provide mentorship/professional advice at the same time
    if (
      option === OPTIONS.preferences.MENTEE &&
      selectedValues[OPTIONS.preferences.MENTOR]
    ) {
      selectedValues[OPTIONS.preferences.MENTOR] = false;
      this.onInputChange(type, selectedValues);
    } else if (
      option === OPTIONS.preferences.MENTOR &&
      selectedValues[OPTIONS.preferences.MENTEE]
    ) {
      selectedValues[OPTIONS.preferences.MENTEE] = false;
      this.onInputChange(type, selectedValues);
    } else if (
      option === OPTIONS.preferences.SEEK_PROF &&
      selectedValues[OPTIONS.preferences.GIVE_PROF]
    ) {
      selectedValues[OPTIONS.preferences.GIVE_PROF] = false;
      this.onInputChange(type, selectedValues);
    } else if (
      option === OPTIONS.preferences.GIVE_PROF &&
      selectedValues[OPTIONS.preferences.SEEK_PROF]
    ) {
      selectedValues[OPTIONS.preferences.SEEK_PROF] = false;
      this.onInputChange(type, selectedValues);
    }

    if (this.props[type].all) {
      selectedValues.all = false;
    }

    if (selectedValues[option]) {
      selectedValues[option] = false;
    } else if (option !== OPTIONS.preferences.ALL) {
      selectedValues[option] = true;
    }
    this.onInputChange(type, selectedValues);
  };

  render() {
    const { error } = this.state;
    const {
      position,
      preferences,
      isLocationPreferred,
      city,
      country,
    } = this.props;

    return (
      <div>
        <Modal
          isOpen={this.state.showExplanation}
          onClose={this.onCloseExplanation}
          buttonText="Got it!"
          header="Why do I need to answer these questions?"
          onButtonClick={this.onCloseExplanation}
          width="600px"
          height="370px"
        >
          <p>
            We will use your answers to find the perfect match for
            you. You will be matched with a minimum of 2 people and a
            maximum of 4 people. <br />
            <br />
            The matching is based on your answers and their other
            members’ answers too! For example, if you are looking for
            a mentor we will try to match you with a group that has a
            mentor who can provide help.
            <br />
            <br />
            If you want to learn more please contact&nbsp;
            <span className="email">
              <a
                href="mailto:info@havenapp.life"
                target="_blank"
                rel="noopener noreferrer"
              >
                info@havenapp.life
              </a>
            </span>
            .
          </p>
        </Modal>
        <h2 className="heading--lg font-weight--regular">
          Let&apos;s get to know you so we can match you with the
          right people!
        </h2>
        <div
          className="spacing-top--md text--md color--purple matchmaking-explanation"
          onClick={this.onShowExplanation}
        >
          Why do I need to answer these questions?
        </div>
        <FormRow label="What do you consider yourself?">
          <SelectableContainer
            value={position}
            options={QUESTION_OPTIONS.position}
            onSelect={option =>
              this.onSelectSingle('position', option)
            }
          />
        </FormRow>
        <FormRow label="What do you want to get from this new community? (select all that apply)">
          <SelectableContainer
            multiselect
            value={preferences}
            options={getFilteredPreferencesOptions(position)}
            onSelect={option =>
              this.onSelectMultiple('preferences', option)
            }
          />
        </FormRow>
        <FormRow label="Would you prefer to meet people in your area?">
          <SelectableContainer
            value={isLocationPreferred}
            options={QUESTION_OPTIONS.isLocationPreferred}
            onSelect={option =>
              this.onSelectSingle('isLocationPreferred', option)
            }
          />
        </FormRow>
        <FormRow>
          {isLocationPreferred ===
            OPTIONS.isLocationPreferred.YES && (
            <>
              <h3 className="text--md font-weight--semi-bold spacing-bottom--xs">
                What city and country are you in?
              </h3>
              <p className="text--md font-weight--regular spacing-bottom--md">
                We&apos;ll use this information to connect you with a
                local community
              </p>
              <div className="form__name spacing-bottom--lg">
                <TextInput
                  label="City"
                  value={city}
                  isHalfWidth={true}
                  onChange={e =>
                    this.onInputChange('city', e.target.value)
                  }
                />
                <TextInput
                  label="Country"
                  value={country}
                  isHalfWidth={true}
                  onChange={e =>
                    this.onInputChange('country', e.target.value)
                  }
                />
              </div>
            </>
          )}
        </FormRow>
        <div className="button-wrapper spacing-bottom--md">
          {error ? (
            <p className="error-message">
              Please complete each question
            </p>
          ) : null}
          <Button
            variant="primary"
            disabled={error}
            isFullWidth={true}
            onClick={this.onContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    );
  }
}

MatchmakingScreen.propTypes = {
  goToNextStep: PropTypes.func,
  onInputChange: PropTypes.func,
  position: PropTypes.string,
  preferences: PropTypes.object,
  isLocationPreferred: PropTypes.string,
  city: PropTypes.string,
  country: PropTypes.string,
};
