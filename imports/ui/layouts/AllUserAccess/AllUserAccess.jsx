import React from 'react';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';

import Navigation from '../../components/Navigation/Navigation';

const AllUserAccess = ({ loggingIn, authenticated, component, ...rest }) => (
  <div className="all-access" style={{ marginTop: '55px' }}>
    <Navigation {...this.props} />
    <Route
      {...rest}
      render={props => (
        React.createElement(component, { ...props, loggingIn, authenticated })
      )}
    />
  </div>
);

AllUserAccess.propTypes = {
  loggingIn: PropTypes.bool,
  authenticated: PropTypes.bool,
  component: PropTypes.func,
};

export default AllUserAccess;
