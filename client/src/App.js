import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import './App.css';
import { ApolloClient } from 'apollo-client';
import { split } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { setContext } from 'apollo-link-context';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

import { AUTH_TOKEN } from 'src/constants';
import PrivateRoute from 'src/components/PrivateRoute/PrivateRoute';
import LoginPage from './Views/Login/LoginPage';
import OnboardingContainer from './Views/Onboarding/OnboardingContainer';
import MainPageContainer from './Views/Main/MainPageContainer';
import { createUploadLink } from 'apollo-upload-client';

import 'react-toastify/dist/ReactToastify.min.css';

const httpLink = createUploadLink({
  uri: 'http://159.203.36.23/graphql/',
});

const wsLink = new WebSocketLink({
  uri: 'ws://159.203.36.23/graphql/',
  options: {
    reconnect: true,
  },
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
}).concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    );
  },
  wsLink,
  authLink,
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

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
          <PrivateRoute
            path={['/t/:id', '/']}
            component={MainPageContainer}
          />
        </Switch>
      </Router>
      <ToastContainer
        type={toast.TYPE.INFO}
        position="bottom-center"
        autoClose={5000}
        pauseOnVisibilityChange
        pauseOnHover
        draggable={false}
        newestOnTop={false}
        closeButton={false}
        closeOnClick={false}
        toastClassName="haven-toast"
        progressClassName="haven-toast-progress"
      />
    </ApolloProvider>
  );
}

export default App;
