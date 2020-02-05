import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import { AUTH_TOKEN } from 'src/constants';

export default function PrivateRoute({
  component: Component,
  ...rest
}) {
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

PrivateRoute.propTypes = {
  location: PropTypes.object,
  component: PropTypes.node,
};
