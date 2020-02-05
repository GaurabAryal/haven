import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import './App.css';
import LoginPage from './Views/Login/LoginPage';
import OnboardingContainer from './Views/Onboarding/OnboardingContainer';
import ApolloClient from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { AUTH_TOKEN } from 'src/constants';

const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function Test() {
  return <div>test</div>;
}

function PrivateRoute({ component: Component, ...rest }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <Route
      {...rest}
      render={props =>
        authToken ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Route path="/onboarding" component={OnboardingContainer} />
          <PrivateRoute path="/" component={Test} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
