import React from 'react';
import PropTypes from 'prop-types';
import OnboardingRow from '../OnboardingRow/OnboardingRow';
import Button from 'src/components/Button/Button';
import TextInput from 'src/components/TextInput/TextInput';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';
import 'src/utils.css';
import './MatchmakingScreen.css';

const options = {
  position: {
    RELATIVE: 'relative',
    PROFESSIONAL: 'professional',
    FRIEND: 'friend',
    OTHER: 'other',
    UNKNOWN: 'unknown',
  },
  preferences: {
    ALL: 'all',
    FRIENDS: 'friends',
    SOCIALIZING: 'socializing',
    MENTEE: 'mentee',
    MENTOR: 'mentor',
    SEEK_PROF: 'seekProfessional',
    GIVE_PROF: 'giveProfessional',
  },
  isLocationPreferred: {
    YES: 'yes',
    NO: 'no',
  },
};

const QUESTION_OPTIONS = {
  position: {
    [options.position.RELATIVE]: 'Relative of person with dementia',
    [options.position.PROFESSIONAL]: 'Professional caregiver',
    [options.position.FRIEND]: 'Friend of person with dementia',
    [options.position.OTHER]: 'Other',
    [options.position.UNKNOWN]: 'Prefer not to say',
  },
  preferences: {
    [options.preferences.ALL]: 'All',
    [options.preferences.FRIENDS]: 'Make new friends',
    [options.preferences.SOCIALIZING]: 'General socializing',
    [options.preferences.MENTEE]: 'Seeking mentorship',
    [options.preferences.MENTOR]: 'Provide mentorship',
    [options.preferences.SEEK_PROF]: 'Seeking professional advice',
    [options.preferences.GIVE_PROF]: 'Giving professional advice',
  },
  isLocationPreferred: {
    [options.isLocationPreferred.YES]: 'Yes',
    [options.isLocationPreferred.NO]: 'No preference',
  },
};

export default class MatchmakingScreen extends React.Component {
  state = {
    error: false,
  };

  getFilteredPreferencesOptions() {
    const isProfessional =
      this.props.position === options.position.PROFESSIONAL;
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
    } = this.props;

    const isFieldsFilled = Boolean(
      position &&
        this.props.isLocationPreferred &&
        Object.keys(preferences).length,
    );
    const isLocationFilled = Boolean(city && country);

    return (
      isFieldsFilled &&
      ((isLocationPreferred === options.isLocationPreferred.YES &&
        isLocationFilled) ||
        isLocationPreferred === options.isLocationPreferred.NO)
    );
  }

  onContinue = () => {
    if (this.isValidInputs()) {
      if (
        this.props.position !== options.position.PROFESSIONAL &&
        this.props.preferences[options.preferences.GIVE_PROF]
      ) {
        const preferences = Object.assign(this.props.preferences, {});
        preferences[options.preferences.GIVE_PROF] = false;
        this.props.onInputChange('preferences', preferences);
      }

      if (
        this.props.isLocationPreferred ===
          options.isLocationPreferred.NO &&
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
      option === options.preferences.ALL &&
      !this.props[type][options.preferences.ALL]
    ) {
      this.onInputChange(type, { [options.preferences.ALL]: true });
      return;
    }
    const selectedValues = Object.assign(this.props[type], {});

    if (this.props[type].all) {
      selectedValues.all = false;
    }

    if (selectedValues[option]) {
      selectedValues[option] = false;
    } else if (option !== options.preferences.ALL) {
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
        <h2 className="heading--lg font-weight--regular">
          Let&apos;s get to know you so we can match you with the
          right people!
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
            multiselect
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
          {isLocationPreferred ===
            options.isLocationPreferred.YES && (
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
