import React from 'react';
import PropTypes from 'prop-types';
import OnboardingRow from '../OnboardingRow/OnboardingRow';
import Button from 'src/components/Button/Button';
import TextInput from 'src/components/TextInput/TextInput';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';
import 'src/utils.css';
import './MatchmakingScreen.css';

const QUESTION_OPTIONS = {
  position: {
    relative: 'Relative of person with dementia',
    professional: 'Professional caregiver',
    friend: 'Friend of person with dementia',
    other: 'Other',
    unknown: 'Prefer not to say',
  },
  preferences: {
    all: 'All',
    friends: 'Make new friends',
    socializing: 'General socializing',
    mentee: 'Seeking mentorship',
    mentor: 'Provide mentorship',
    seekProfessional: 'Seeking professional advice',
    giveProfessional: 'Giving professional advice',
  },
  isLocationPreferred: {
    yes: 'Yes',
    no: 'No preference',
  },
};

export default class MatchmakingScreen extends React.Component {
  state = {
    position: {},
    preferences: {},
    isLocationPreferred: {},
    city: '',
    country: '',
    error: false,
  };

  getFilteredPreferencesOptions() {
    const isProfessional = this.state.position.professional;
    if (isProfessional) {
      return QUESTION_OPTIONS.preferences;
    } else {
      const filteredOptions = Object.assign(
        {},
        QUESTION_OPTIONS.preferences,
      );
      delete filteredOptions.giveProfessional;
      return filteredOptions;
    }
  }

  isValidInputs() {
    const {
      position,
      preferences,
      isLocationPreferred,
      city,
      country,
    } = this.state;

    const isFieldsFilled = Boolean(
      Object.keys(position).length &&
        Object.keys(preferences).length &&
        Object.keys(isLocationPreferred).length,
    );

    const isLocationFilled = Boolean(city && country);

    return (
      isFieldsFilled &&
      ((isLocationPreferred.yes && isLocationFilled) ||
        isLocationPreferred.no)
    );
  }

  onContinue = () => {
    if (this.isValidInputs()) {
      this.props.goToNextStep();
    } else {
      this.setState({ error: true });
    }
  };

  onInputChange = (inputType, value) => {
    this.setState({ [inputType]: value, error: false });
  };

  onSelectSingle = (type, option) => {
    if (
      !this.state.position.professional &&
      this.state.preferences.giveProfessional
    ) {
      const preferences = Object.assign(this.state.preferences, {});
      preferences.giveProfessional = false;
      this.setState({ preferences });
    }

    if (!this.state[type][option]) {
      this.setState({ [type]: { [option]: true }, error: false });
    } else {
      this.setState({ [type]: false, error: false });
    }
  };

  onSelectMultiple = (type, option) => {
    if (option === 'all' && !this.state[type].all) {
      this.setState({ [type]: { all: true }, error: false });
      return;
    }
    const selectedValues = Object.assign(this.state[type], {});

    if (this.state[type].all) {
      selectedValues.all = false;
    }

    if (selectedValues[option]) {
      selectedValues[option] = false;
    } else if (option !== 'all') {
      selectedValues[option] = true;
    }
    this.setState({ [type]: selectedValues, error: false });
  };

  render() {
    const {
      position,
      preferences,
      isLocationPreferred,
      city,
      country,
      error,
    } = this.state;

    return (
      <div>
        <h2 className="heading--lg font-weight--regular">
          Let&apos;s get to know you so we can match you with the right
          people!
        </h2>
        <OnboardingRow label="What do you consider yourself?">
          <SelectableContainer
            value={position}
            options={QUESTION_OPTIONS.position}
            onSelect={option =>
              this.onSelectSingle('position', option)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="What do you want to get from this new community? (select all that apply)">
          <SelectableContainer
            value={preferences}
            options={this.getFilteredPreferencesOptions()}
            onSelect={option =>
              this.onSelectMultiple('preferences', option)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="Would you prefer to meet people in your area?">
          <SelectableContainer
            value={isLocationPreferred}
            options={QUESTION_OPTIONS.isLocationPreferred}
            onSelect={option =>
              this.onSelectSingle('isLocationPreferred', option)
            }
          />
        </OnboardingRow>
        <OnboardingRow>
          {isLocationPreferred.yes && (
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
        </OnboardingRow>
        <div className="button-wrapper spacing-bottom--md">
          {error ? <p className="error-message">Please complete each question</p> : null}
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
};
