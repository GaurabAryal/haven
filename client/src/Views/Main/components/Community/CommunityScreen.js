import React from 'react';
import PropTypes from 'prop-types';

import ContentContainer from '../ContentContainer/ContentContainer';
import WaitingScreen from 'src/Views/Onboarding/components/WaitingScreen/WaitingScreen';
import Button from 'src/components/Button/Button';
import FormRow from 'src/components/FormRow/FormRow';
import SelectableContainer from 'src/components/SelectableContainer/SelectableContainer';
import TextInput from 'src/components/TextInput/TextInput';

import {
  OPTIONS,
  QUESTION_OPTIONS,
  PREFERENCE_MAPPING,
} from 'src/constants';
import { getFilteredPreferencesOptions } from 'src/utils';

export default class CommunityScreen extends React.Component {
  state = {
    step: 1,
    preferences: {},
    isLocationPreferred: '',
    city: '',
    country: '',
    error: false,
  };

  isValidInputs() {
    const {
      preferences,
      isLocationPreferred,
      city,
      country,
    } = this.state;

    const preferenceValues = Object.values(preferences);

    const noPreferenceSelected =
      preferenceValues.every(preference => preference === false) ||
      !preferenceValues.length;

    const isFieldsFilled = Boolean(
      this.state.isLocationPreferred && !noPreferenceSelected,
    );
    const isLocationFilled = Boolean(city && country);

    return (
      isFieldsFilled &&
      ((isLocationPreferred === OPTIONS.isLocationPreferred.YES &&
        isLocationFilled) ||
        isLocationPreferred === OPTIONS.isLocationPreferred.NO)
    );
  }

  goToNextStep = () => {
    this.setState(prevState => {
      return {
        step: prevState.step + 1,
      };
    });
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
      !this.state[type][OPTIONS.preferences.ALL]
    ) {
      this.onInputChange(type, { [OPTIONS.preferences.ALL]: true });
      return;
    }

    const selectedValues = Object.assign(this.state[type], {});

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

    if (this.state[type].all) {
      selectedValues.all = false;
    }

    if (selectedValues[option]) {
      selectedValues[option] = false;
    } else if (option !== OPTIONS.preferences.ALL) {
      selectedValues[option] = true;
    }
    this.onInputChange(type, selectedValues);
  };

  onSubmit = async () => {
    const { preferences, city, country } = this.state;
    const { userId } = this.props;

    if (this.isValidInputs()) {
      if (
        this.props.position !== OPTIONS.position.PROFESSIONAL &&
        this.state.preferences[OPTIONS.preferences.GIVE_PROF]
      ) {
        const preferences = Object.assign(this.state.preferences, {});
        preferences[OPTIONS.preferences.GIVE_PROF] = false;
        this.onInputChange('preferences', preferences);
      }

      if (
        this.state.isLocationPreferred ===
          OPTIONS.isLocationPreferred.NO &&
        (this.state.city || this.state.country)
      ) {
        this.onInputChange('city', '');
        this.onInputChange('country', '');
      }

      const preferenceList = Object.keys(preferences).map(
        preference => PREFERENCE_MAPPING[preference],
      );

      await this.props.joinCommunityMutation({
        variables: {
          city,
          country,
          preferenceList,
          userId,
        },
      });
      this.goToNextStep();
    } else {
      this.setState({ error: true });
    }
  };

  onInputChange = (inputType, value) => {
    this.setState({ [inputType]: value, error: false });
  };

  render() {
    const {
      error,
      preferences,
      isLocationPreferred,
      city,
      country,
    } = this.state;

    return (
      <ContentContainer
        header={
          <div className="text--lg font-weight--bold">
            Join a New Community
          </div>
        }
      >
        {this.state.step === 1 ? (
          <div>
            <FormRow label="What do you want to get from this new community? (select all that apply)">
              <SelectableContainer
                multiselect
                value={preferences}
                options={getFilteredPreferencesOptions(
                  this.props.position,
                )}
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
                    We&apos;ll use this information to connect you
                    with a local community
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
                onClick={this.onSubmit}
              >
                Join
              </Button>
            </div>
          </div>
        ) : (
          <WaitingScreen
            firstName={this.props.firstName}
            goToNextStep={this.goToNextStep}
            isWaiting={this.state.step === 2}
            startPolling={this.props.startPolling}
            stopPolling={this.props.stopPolling}
            groupMembersAmount={this.props.groupMembersAmount}
            goToApp={() => {}}
          />
        )}
      </ContentContainer>
    );
  }
}

CommunityScreen.propTypes = {
  joinCommunityMutation: PropTypes.func,
  groupMembersAmount: PropTypes.number,
  startPolling: PropTypes.func,
  stopPolling: PropTypes.func,
  firstName: PropTypes.string,
  position: PropTypes.string,
  userId: PropTypes.string,
};
