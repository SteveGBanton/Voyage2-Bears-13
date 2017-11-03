import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Loading from '../../../components/Loading/Loading';

if (Meteor.isClient) import './UserView.scss';

const UserView = ({ loading, history, user }) => {
  const firstName = user && user.profile && user.profile.name ? `${user.profile.name.first}` : '';
  const lastName = user && user.profile && user.profile.name ? `${user.profile.name.last}` : '';
  const nameDisplay = `${firstName} ${lastName}`;
  const loadOrNoUser = (
    (user) ?
      <Loading />
      :
      <h3 style={{ margin: 50 }}>Sorry, cannot find user.</h3>
  )
  return (
    (!loading && user) ?
      <div className="user-view">
        <div className="card">
          <Card
            style={{ width: 350 }}
          >
            <CardMedia>
              <img src="/placeholder.png" alt="" />
            </CardMedia>

            <CardTitle
              title={nameDisplay}
              subtitle={user.username}
            />
            <CardText>
              {(user.about) ? user.about : ''
              }
            </CardText>
            {/* <CardActions>
              <FlatButton label="Website" />
              <FlatButton label="Facebook" />
              <FlatButton label="Email" />
            </CardActions> */}
          </Card>
        </div>
        <div className="learning-lists">

          <h2>Learning Paths Created</h2>
          <h2>Saved Learning Paths</h2>

        </div>

        {/*
          Data to display about user:

          First Name, Last Name
          Username
          Description/About
          Website URL
          Learning Paths Created
          Saved Learning Paths

           */}

      </div>
    : loadOrNoUser
  )
}

UserView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
};

export default createContainer(({ match }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('users.getSingle', username);
  const user = Meteor.users.findOne({ username });

  return {
    loading: !subscription.ready(),
    user,
  };
}, UserView);

export { UserView as UserViewTest };
