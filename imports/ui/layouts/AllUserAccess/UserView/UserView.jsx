import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import Loading from '../../../components/Loading/Loading';
import './UserView.scss';

const UserView = ({ loading, history, user }) => (
  (!loading && user) ?
    <div className="user-view">
      <div className="card">
        <Card
          style={{ width: 350 }}
        >
          <CardMedia>
            <img src="/books.jpg" alt="" />
          </CardMedia>

          <CardTitle
            title={`${user.profile.name.first} ${user.profile.name.last}`}
            subtitle={user.username}
          />
          <CardText>
            {(user.about) ? user.about : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi. Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque. Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.'
            }
          </CardText>
          <CardActions>
            <FlatButton label="Website" />
            <FlatButton label="Facebook" />
            <FlatButton label="Email" />
          </CardActions>
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
  : <Loading />
);

UserView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  history: PropTypes.object.isRequired,
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
