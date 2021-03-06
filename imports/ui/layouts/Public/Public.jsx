import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

import Navigation from '../../components/Navigation/Navigation';

export default class Public extends React.Component {
  render() {
    const { loggingIn, authenticated, component, user, ...rest } = this.props;
    return (
      <div className="public">
        <Navigation {...this.props} />
        <Route
          {...rest}
          render={props => (
            !authenticated ?
              (React.createElement(component, { ...props, loggingIn, authenticated })) :
              (<Redirect to={`/create-path`} />)
          )}
        />
      </div>

    );
  }
}

Public.defaultProps = {
  user: null,
};

Public.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};
