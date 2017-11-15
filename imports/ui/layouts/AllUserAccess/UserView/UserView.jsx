import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';

import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';

import LearningPathCollection from '../../../../api/LearningPath/LearningPath';

import Loading from '../../../components/Loading/Loading';

if (Meteor.isClient) import './UserView.scss';

const UserView = ({ loading, history, user, createdPaths, savedPaths }) => {
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

          <h2>Recent Learning Paths Created</h2>

          <div className="path-list">
            {
              !loading ?
                <RenderLearningPathList
                  learningPathList={createdPaths}
                  user={user}
                  userId={user._id}
                /> :
                <Loading />
            }
          </div>


          <h2>Recent Saved Learning Paths</h2>

          <div className="path-list">
            {
              !loading ?
                <RenderLearningPathList
                  learningPathList={savedPaths}
                  user={user}
                  userId={user._id}
                /> :
                <Loading />
            }
          </div>

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

UserView.defaultProps = {
  savedPaths: [],
  createdPaths: [],
}

UserView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
  savedPaths: PropTypes.arrayOf(PropTypes.shape({})),
  createdPaths: PropTypes.arrayOf(PropTypes.shape({})),
};

export default createContainer(({ match }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('users.getSingle', username);
  const user = Meteor.users.findOne({ username });
  const opts = { sort: ['aggregatedVotes', 'desc'], limit: 6 }
  const subscriptionPaths = (user) ? Meteor.subscribe('learning-paths', {}, opts) : null;

  const createdPaths = (user) ? LearningPathCollection.find({ mentor: user._id }).fetch() : []

  const savedPathsIDs = [];
  const keys = (user) ? Object.keys(user.savedLearningPaths) : [];
  for (let i = 0; i < keys.length; i += 1) {
    if (user.savedLearningPaths[keys[i]] === true) {
      savedPathsIDs.push(keys[i]);
    }
  }
  const savedPaths = LearningPathCollection.find({"_id" : { "$in" : savedPathsIDs}}).fetch();

  return {
    loading: !subscription.ready(),
    user,
    createdPaths,
    savedPaths,
  };
}, UserView);

export { UserView as UserViewTest };
