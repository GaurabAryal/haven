import React from 'react';
import PropTypes from 'prop-types';
import OnboardingRow from '../OnboardingRow/OnboardingRow';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';

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

    console.log("what'", isLocationFilled, city, country);

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
        <div>Haven</div>
        <div>Step 1 of 2</div>
        <div>
          Let&apos;s get to know you so we match with the right
          people!
        </div>
        <OnboardingRow label="What do you consider yourself?">
          <SelectableContainer
            value={position}
            options={QUESTION_OPTIONS.position}
            onSelect={option =>
              this.onSelectSingle('position', option)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="What do you want to get from this new community?">
          <SelectableContainer
            value={preferences}
            options={this.getFilteredPreferencesOptions()}
            onSelect={option =>
              this.onSelectMultiple('preferences', option)
            }
          />
        </OnboardingRow>
        <OnboardingRow label="Would you prefer to meet people in this area?">
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
              We&apos;ll use this information to connect you with a
              local community
              <input
                type="text"
                value={city}
                placeholder="City"
                onChange={e =>
                  this.onInputChange('city', e.target.value)
                }
              />
              <input
                type="text"
                value={country}
                placeholder="country"
                onChange={e =>
                  this.onInputChange('country', e.target.value)
                }
              />
            </>
          )}
        </OnboardingRow>
        {error && <div>Please fill in all fields</div>}
        <button disabled={error} onClick={this.onContinue}>
          Continue
        </button>
      </div>
    );
  }
}

MatchmakingScreen.propTypes = {
  goToNextStep: PropTypes.func,
};
