import React from 'react';
import './LoginPage.css';
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
    isLogin: true,
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
      showPassword,
    } = this.state;

    return (
      <Mutation
        mutation={isLogin ? LOGIN_MUTATION : SIGNUP_MUTATION}
        variables={{ email, password, firstName, lastName }}
        onCompleted={data => this._confirm(data)}
      >
        {mutation => (
          <div className="loginPage-container">
            <div>Haven</div>
            <h1>
              Connect with caregivers of people with dementia and find
              your community
            </h1>
            <div>
              {isLogin ? 'Sign in' : 'Sign up to get started'}
            </div>
            {!isLogin ? (
              <>
                <input
                  type="text"
                  value={email}
                  placeholder="first name"
                  onChange={e =>
                    this.onInputChange('firstName', e.target.value)
                  }
                />
                <input
                  type="text"
                  value={email}
                  placeholder="last name"
                  onChange={e =>
                    this.onInputChange('lastName', e.target.value)
                  }
                />
              </>
            ) : null}
            <input
              type="text"
              value={email}
              placeholder="email"
              onChange={e =>
                this.onInputChange('email', e.target.value)
              }
            />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              placeholder="password"
              onChange={e =>
                this.onInputChange('password', e.target.value)
              }
            />
            <button
              onClick={() =>
                this.setState(prevState => ({
                  showPassword: !prevState.showPassword,
                }))
              }
            >
              Show password eye picture icon thing
            </button>
            <button
              disabled={error}
              onClick={() => this.login(mutation)}
            >
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
            {error ? <div>Please fill in all fields</div> : null}
            {isLogin ? (
              <div>
                Don't have an account?{' '}
                <a onClick={() => this.setState({ isLogin: false })}>
                  Sign up
                </a>
              </div>
            ) : (
              <div>
                Have an account?{' '}
                <a onClick={() => this.setState({ isLogin: true })}>
                  Log in
                </a>
              </div>
            )}
          </div>
        )}
      </Mutation>
    );
  }
}

LoginPage.propTypes = {
  history: PropTypes.object,
};
