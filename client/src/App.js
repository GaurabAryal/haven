import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import './App.css';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { AUTH_TOKEN } from 'src/constants';
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute';
import LoginPage from './Views/Login/LoginPage';
import OnboardingContainer from './Views/Onboarding/OnboardingContainer';

const httpLink = createHttpLink({
  uri: 'http://159.203.36.23/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem(AUTH_TOKEN);
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

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <PrivateRoute
            path="/onboarding"
            component={OnboardingContainer}
          />
          <PrivateRoute path="/" component={Test} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
}

export default App;
