import React from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import FontIcon from 'material-ui/FontIcon';

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
  const { authenticated, history, toggleMenu } = props;
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
            <Link to={'/'}>
              <ToolbarTitle style={{ color: 'white', paddingLeft: '20px' }} text="LearnMap" />
            </Link>
          </ToolbarGroup>
        :
          <ToolbarGroup>
            <Link to={'/'}>
              <ToolbarTitle style={{ color: 'white', paddingLeft: '15px' }} text="LearnMap" />
            </Link>
          </ToolbarGroup>
      }
      <ToolbarGroup>

        <Link to={`/learning-paths`}>
          <RaisedButton
            label="Find Paths"
            backgroundColor="#00796B"
            labelStyle={{ color: 'white' }}
          />
        </Link>

        <IconMenu
          menuStyle={{ width: "250px" }}
          onItemTouchTap={() => { this.open = null; }}
          style={{ marginLeft: 10 }}
          iconButtonElement={
            <IconButton touch>
              <FontIcon className="material-icons" color="white">more_vert</FontIcon>
            </IconButton>
          }
        >

          {/* <MenuItem
            primaryText="Find Learning Paths"
            onClick={() => history.push(`/learning-paths`)}
            leftIcon={<FontIcon className="material-icons">search</FontIcon>}
          /> */}

          {authenticated ?
            <MenuItem
              primaryText="Create A Learning Path"
              onClick={() => history.push(`/create-path`)}
              leftIcon={<FontIcon className="material-icons">add</FontIcon>}
            />
            : ''
          }

          {authenticated ?
            <MenuItem
              primaryText="My Learning Paths"
              onClick={() => history.push(`/my-paths`)}
              leftIcon={<FontIcon className="material-icons">create</FontIcon>}
            />
            : ''
          }

          {authenticated ?
            <MenuItem
              primaryText="Saved Learning Paths"
              onClick={() => history.push(`/my-saved-paths`)}
              leftIcon={<FontIcon className="material-icons">favorite</FontIcon>}
            />
            : ''
          }

          {authenticated ?
            <MenuItem
              primaryText="Edit Profile"
              onClick={() => history.push(`/profile`)}
              leftIcon={<FontIcon className="material-icons">settings</FontIcon>}
            />
            : ''
          }

          {authenticated ?
            <MenuItem
              primaryText="Sign out"
              onClick={() => Meteor.logout()}
              leftIcon={<FontIcon className="material-icons">exit_to_app</FontIcon>}
            />
            :
            <MenuItem
              primaryText="Sign in"
              onClick={() => { location.href = "/login"; }}
              leftIcon={<FontIcon className="material-icons">account_circle</FontIcon>}
            />
          }

          {!authenticated ?
            <MenuItem
              primaryText="Create Account"
              onClick={() => { location.href = "/signup"; }}
              leftIcon={<FontIcon className="material-icons">person_add</FontIcon>}
            />
            :
            ''
          }

        </IconMenu>
      </ToolbarGroup>
    </Toolbar>
  );
};

Navigation.defaultProps = {
  name: '',
  authenticated: false,
  toggleMenu: false,
};

Navigation.propTypes = {
  authenticated: PropTypes.bool,
  history: PropTypes.shape({}).isRequired,
  toggleMenu: PropTypes.bool,
};

export default withRouter(Navigation);
