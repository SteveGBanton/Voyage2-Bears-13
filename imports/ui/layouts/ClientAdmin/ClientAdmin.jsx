import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect, Link } from 'react-router-dom';

import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import Person from 'material-ui/svg-icons/social/person';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';

import Navigation from '../../components/Navigation/Navigation';
import AddUsername from '../../components/AddUsername/AddUsername';

import './ClientAdmin.scss';

export default class ClientAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.toggleMenu = this.toggleMenu.bind(this);
    this.state = {
      menuOpen: true,
    };
  }

  toggleMenu() {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  }

  render() {
    const { loggingIn, authenticated, component, user, ...rest } = this.props;
    const usernameAskOrLogout = (authenticated && !user.username) ?
      <AddUsername />
      :
      (<Redirect to="/logout" />);
    return (
      <div className="dashboard">

        <Navigation {...this.props} toggleMenu={this.toggleMenu} />

        {(user && user.username) ?
          <div className={(this.state.menuOpen) ? "dashboard-menu" : "dashboard-menu-closed"}>
            <Drawer
              className="dashboard-drawer"
              containerStyle={{ width: '250px', zIndex: '1000', marginTop: '55px', backgroundColor: '#f9f9f9', paddingTop: "20px" }}
              open={this.state.menuOpen}
            >
              <Link to={`/create-path`}>
                <MenuItem
                  primaryText="Create Learning Path"
                  leftIcon={
                    <PersonAdd
                      color="#757575"
                      style={{ paddingLeft: "10px" }}
                    />}
                />
              </Link>

              <Link to={`/my-paths`}>
                <MenuItem
                  primaryText="View My Paths"
                  leftIcon={
                    <RemoveRedEye
                      color="#757575"
                      style={{ paddingLeft: "10px" }}
                    />}
                />
              </Link>

              <Link to={`/my-saved-paths`}>
                <MenuItem
                  primaryText="View Saved Paths"
                  leftIcon={
                    <RemoveRedEye
                      color="#757575"
                      style={{ paddingLeft: "10px" }}
                    />}
                />
              </Link>

              <Divider
                style={{ backgroundColor: "#757575", marginTop: "16px", marginBottom: "16px" }}
              />
              <Link to={`/learning-paths`}>
                <MenuItem
                  primaryText="Learning Paths (Public)"
                  leftIcon={
                    <RemoveRedEye
                      color="#757575"
                      style={{ paddingLeft: "10px" }}
                    />}
                />
              </Link>
            </Drawer>
          </div>
          :
          ''
        }

        <div className={(this.state.menuOpen) ? "inner-route" : "inner-route-full"}>
          <Route
            {...rest}
            render={props => (
              authenticated && user.username
                ? (React.createElement(component, { ...props, loggingIn, authenticated, user }))
                : usernameAskOrLogout
            )}
          />
        </div>
      </div>
    );
  }
}

ClientAdmin.defaultProps = {
  user: {},
};

ClientAdmin.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  user: PropTypes.shape({}),
};
