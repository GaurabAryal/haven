import React from 'react';
import 'src/App.css';
import 'src/utils.css';
import './LoginPage.css';
import TextInput from 'src/components/TextInput/TextInput';
import Button from 'src/components/Button/Button';
import { ReactComponent as HavenLogo } from './images/haven-logo.svg';
import { Mutation } from '@apollo/react-components';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import { AUTH_TOKEN } from 'src/constants';

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation(
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
  ) {
    signup(email: $email, password: $password) {
      token
    }
  }
`;

export default class LoginPage extends React.Component {
  state = {
    isLogin: false,
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    showPassword: false,
    error: false,
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  _confirm = async data => {
    const { token } = this.state.login ? data.login : data.signup;
    this._saveUserData(token);
    this.props.history.push(`/`);
  };

  login = mutation => {
    const {
      isLogin,
      email,
      password,
      firstName,
      lastName,
    } = this.state;

    if (!email || !password) {
      this.setState({ error: true });
    } else if (!isLogin && (!firstName || !lastName)) {
      this.setState({ error: true });
    } else {
      mutation();
    }
  };

  onInputChange = (inputType, value) => {
    this.setState({ [inputType]: value, error: false });
  };

  render() {
    const {
      isLogin,
      email,
      password,
      firstName,
      lastName,
      error,
    } = this.state;

    return (
      <Mutation
        mutation={isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION}
        variables={{ email, password, firstName, lastName }}
        onCompleted={data => this._confirm(data)}
      >
        {mutation => (
          <div className="page-container">
            <div className="haven-logo center--horizontally spacing-top--lg">
              <HavenLogo />
            </div>
            <h1 className="page-container__heading heading--lg text-align--center">
              Connect with caregivers of people with dementia and find
              your community
            </h1>
            <div className="form-container">
              <h2 className="heading--md text-align--center spacing-bottom--md">
                {isLogin ? 'Sign in' : 'Sign up to get started'}
              </h2>
              {!isLogin && (
                <div className="form__name spacing-bottom--sm">
                  <TextInput
                    label="First name"
                    value={firstName}
                    isHalfWidth={true}
                    onChange={e =>
                      this.onInputChange('firstName', e.target.value)
                    }
                  />
                  <TextInput
                    label="Last name"
                    value={lastName}
                    isHalfWidth={true}
                    onChange={e =>
                      this.onInputChange('lastName', e.target.value)
                    }
                  />
                </div>
              )}

              <div className="spacing-bottom--sm">
                <TextInput
                  label="Email"
                  value={email}
                  onChange={e =>
                    this.onInputChange('email', e.target.value)
                  }
                />
              </div>
              <div className="spacing-bottom--lg">
                <TextInput
                  label="Password"
                  value={password}
                  onChange={e =>
                    this.onInputChange('password', e.target.value)
                  }
                />
              </div>
              {/* <button
                onClick={() =>
                  this.setState(prevState => ({
                    showPassword: !prevState.showPassword,
                  }))
                }
              >
                Show password eye picture icon thing
              </button> */}
              <div className="button-wrapper">
                {error ? (
                  <p className="error-message">
                    Please enter valid fields
                  </p>
                ) : null}
                <Button
                  variant="primary"
                  disabled={error}
                  isFullWidth={true}
                  onClick={() => this.login(mutation)}
                >
                  {isLogin ? 'Sign in' : 'Sign up'}
                </Button>
              </div>

              {isLogin ? (
                <div className="text-align--center spacing-top--sm color--grey text--md">
                  Don't have an account?{' '}
                  <a
                    onClick={() => this.setState({ isLogin: false })}
                  >
                    Sign up
                  </a>
                </div>
              ) : (
                <div className="text-align--center spacing-top--md color--grey text--md">
                  Already have an account?{' '}
                  <a onClick={() => this.setState({ isLogin: true })}>
                    Log in
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </Mutation>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object,
};
