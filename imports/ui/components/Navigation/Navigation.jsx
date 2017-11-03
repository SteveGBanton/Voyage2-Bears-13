import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';

import './Navigation.scss';

const styles = {
  toolbar: {
    backgroundColor: '#009688',
    width: '100%',
    position: 'fixed',
    top: '0',
    left: '0',
    zIndex: 1200,
    boxShadow: 'rgba(0, 0, 0, 0.18) 0px 2px 6px, rgba(0, 0, 0, 0.18) 0px 3px 4px',
  },
};

const Navigation = (props) => {
  const { authenticated, history, user, toggleMenu } = props;
  console.log(props)
  return (
    <Toolbar style={styles.toolbar}>
      {authenticated && toggleMenu
        ?
          <ToolbarGroup>
            <MenuIcon
              color="rgba(255,255,255,0.7)"
              hoverColor="rgba(255,255,255,0.9)"
              className="pointer"
              onClick={toggleMenu}
            />
            <ToolbarSeparator />
            <ToolbarTitle style={{ color: 'white', paddingLeft: '20px' }} text="Learn-Map Dashboard" />
          </ToolbarGroup>
        :
          <ToolbarGroup>
            <ToolbarTitle style={{ color: 'white', paddingLeft: '20px' }} text="Learn-Map Dashboard" />
          </ToolbarGroup>
      }
      <ToolbarGroup>
        {authenticated
          ?
            <Link to={`/dashboard`}><RaisedButton label="Dashboard" backgroundColor="#00796B" labelStyle={{ color: 'white' }} /></Link>
          : ''
        }
        <IconMenu
          menuStyle={{ width: "250px" }}
          onItemTouchTap={() => this.open = null}
          iconButtonElement={
            <IconButton touch>
              <NavigationExpandMoreIcon color="white" />
            </IconButton>
          }
        >

          {authenticated
            ? <MenuItem primaryText="Edit Profile" onClick={() => history.push(`/profile`)} />
            : ''
          }

          {authenticated
            ? <MenuItem primaryText="Sign out" onClick={() => Meteor.logout()} />
            : <MenuItem primaryText="Sign in" onClick={() => { location.href = "/login"; }} />
          }

          {authenticated
            ? ''
              : <MenuItem primaryText="Create Account" onClick={() => { location.href = "/signup"; }} />
          }

        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

Navigation.defaultProps = {
  name: '',
  authenticated: false,
};

Navigation.propTypes = {
  authenticated: PropTypes.bool,
};

export default withRouter(Navigation);
