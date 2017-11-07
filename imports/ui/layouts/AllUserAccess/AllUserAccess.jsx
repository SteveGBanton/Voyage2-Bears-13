import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Navigation from '../../components/Navigation/Navigation';
import AddUsername from '../../components/AddUsername/AddUsername';

const AllUserAccess = ({ loggingIn, authenticated, component, user, ...rest }) => (
  <div className="all-access">
    <Navigation
      authenticated={authenticated}
      history={history}
      user={user}
      {...rest}
    />
    {console.log(authenticated)}
    <Route
      {...rest}
      render={props => (
        authenticated && !user.username
          ? <AddUsername />
          : (React.createElement(component, { ...props, loggingIn, authenticated, user }))
      )}
    />
  </div>
);

AllUserAccess.defaultProps = {
  user: null,
  loggingIn: null,
  authenticated: null,
  component: null,
};

AllUserAccess.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
  user: PropTypes.shape({}),
};

export default AllUserAccess;
