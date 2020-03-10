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

const REGISTER_MUTATION = gql`
  mutation RegisterMutation(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    register(
      userInput: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        id
        email
        password
      }
    }

    login(username: $email, password: $password) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(username: $email, password: $password) {
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
    isError: false,
  };

  componentDidMount() {
    if (localStorage[AUTH_TOKEN]) {
      localStorage.removeItem(AUTH_TOKEN);
    }
  }

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  _confirm = async data => {
    this._saveUserData(data.login?.token || '');
    this.props.history.push(`/onboarding`);
  };

  login = (mutation, event) => {
    const {
      isLogin,
      email,
      password,
      firstName,
      lastName,
    } = this.state;

    if (event) event.preventDefault();

    if (!email || !password) {
      this.setState({ isError: true });
    } else if (!isLogin && (!firstName || !lastName)) {
      this.setState({ isError: true });
    } else {
      mutation();
    }
  };

  onInputChange = (inputType, value) => {
    this.setState({
      [inputType]: value,
      isError: false,
    });
  };

  render() {
    const {
      isLogin,
      email,
      password,
      firstName,
      lastName,
      isError,
    } = this.state;

    return (
      <Mutation
        mutation={isLogin ? LOGIN_MUTATION : REGISTER_MUTATION}
        variables={{ email, password, firstName, lastName }}
        onCompleted={data => this._confirm(data)}
        onError={() => this.setState({ isError: true })}
      >
        {(mutation, { client, error }) => {
          client.clearStore();
          const errorMessage =
            isError && error && error.graphQLErrors[0]
              ? error.graphQLErrors[0].message
              : isError
              ? 'Please enter valid fields'
              : null;
          return (
            <div className="page-container">
              <div className="haven-logo center--horizontally spacing-top--md">
                <HavenLogo />
              </div>
              <h1 className="page-container__heading heading--lg text-align--center">
                Connect with caregivers of people with dementia and
                find your community
              </h1>
              <div className="form-container">
                <h2 className="heading--md text-align--center spacing-bottom--md">
                  {isLogin ? 'Sign in' : 'Sign up to get started'}
                </h2>
                <form onSubmit={event => this.login(mutation, event)}>
                  {!isLogin && (
                    <div className="form__name spacing-bottom--sm">
                      <TextInput
                        label="First name"
                        value={firstName}
                        isHalfWidth={true}
                        onChange={e =>
                          this.onInputChange(
                            'firstName',
                            e.target.value,
                          )
                        }
                      />
                      <TextInput
                        label="Last name"
                        value={lastName}
                        isHalfWidth={true}
                        onChange={e =>
                          this.onInputChange(
                            'lastName',
                            e.target.value,
                          )
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
                      type="password"
                      value={password}
                      onChange={e =>
                        this.onInputChange('password', e.target.value)
                      }
                    />
                  </div>
                  <div className="button-wrapper">
                    <p className="error-message">{errorMessage}</p>
                    <Button
                      variant="primary"
                      disabled={isError}
                      isFullWidth={true}
                      onClick={() => this.login(mutation)}
                    >
                      {isLogin ? 'Sign in' : 'Sign up'}
                    </Button>
                  </div>
                </form>
                {isLogin ? (
                  <div className="text-align--center spacing-top--sm color--grey text--md">
                    Don&apos;t have an account?{' '}
                    <span
                      className="login-switch"
                      onClick={() =>
                        this.setState({
                          isLogin: false,
                          isError: false,
                        })
                      }
                    >
                      Sign up
                    </span>
                  </div>
                ) : (
                  <div className="text-align--center spacing-top--sm spacing-bottom--md color--grey text--md">
                    Already have an account?{' '}
                    <span
                      className="login-switch"
                      onClick={() =>
                        this.setState({
                          isLogin: true,
                          isError: false,
                        })
                      }
                    >
                      Log in
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        }}
      </Mutation>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object,
};
