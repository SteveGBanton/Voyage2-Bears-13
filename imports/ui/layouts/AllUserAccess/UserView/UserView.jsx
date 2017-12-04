import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import { Card, CardMedia, CardTitle, CardText } from 'material-ui/Card';

import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';
import LearningPathCollection from '../../../../api/LearningPath/LearningPath';

import Loading from '../../../components/Loading/Loading';

import './UserView.scss';

const UserView = ({
  loading,
  user,
  createdPaths,
  savedPaths,
  userForUserNameOnPage,
}) => {
  const firstName = userForUserNameOnPage &&
    userForUserNameOnPage.profile &&
    userForUserNameOnPage.profile.name &&
    userForUserNameOnPage.profile.name.first ?
      `${userForUserNameOnPage.profile.name.first}`
      :
      '';
  const lastName = userForUserNameOnPage &&
    userForUserNameOnPage.profile &&
    userForUserNameOnPage.profile.name &&
    userForUserNameOnPage.profile.name.first ?
      `${userForUserNameOnPage.profile.name.last}`
      :
      '';
  const nameDisplay = `${firstName} ${lastName}`;
  const loadOrNoUser = (
    (userForUserNameOnPage) ?
      <Loading />
      :
      <h3 style={{ margin: 50 }}>Sorry, cannot find user.</h3>
  );
  return (
    (!loading && userForUserNameOnPage) ?
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
              subtitle={userForUserNameOnPage.username}
            />
            <CardText>
              {(userForUserNameOnPage.about) ?
                  userForUserNameOnPage.about
                  :
                  ''
              }
            </CardText>
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
                  userId={(user) ? user._id : null}
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
                  userId={(user) ? user._id : null}
                /> :
                  <Loading />
            }
          </div>

        </div>

        {/*
          TODO Data to display about user:

          First Name, Last Name
          Username
          Description/About
          Website URL
          Learning Paths Created
          Saved Learning Paths

           */}

      </div>
    : loadOrNoUser
  );
};

UserView.defaultProps = {
  savedPaths: [],
  createdPaths: [],
  user: null,
  userForUserNameOnPage: null,
};

UserView.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: PropTypes.shape({}),
  savedPaths: PropTypes.arrayOf(PropTypes.shape({})),
  createdPaths: PropTypes.arrayOf(PropTypes.shape({})),
  userForUserNameOnPage: PropTypes.shape({}),
};

export default createContainer(({ match, user }) => {
  const username = match.params.username;
  const subscription = Meteor.subscribe('users.getSingle', username);
  const userForUserNameOnPage = Meteor.users.findOne({ username });
  // const opts = { sort: ['aggregatedVotes', 'desc'], limit: 6 };
  // const subscriptionPaths = (userForUserNameOnPage) ? Meteor.subscribe('learning-paths', {}, opts) : null;

  const createdPaths = (userForUserNameOnPage) ?
    LearningPathCollection
      .find({ mentor: userForUserNameOnPage._id })
      .fetch()
    :
    [];

  const savedPathsIDs = [];
  const keys = (userForUserNameOnPage) ? Object.keys(userForUserNameOnPage.savedLearningPaths) : [];
  for (let i = 0; i < keys.length; i += 1) {
    if (userForUserNameOnPage.savedLearningPaths[keys[i]] === true) {
      savedPathsIDs.push(keys[i]);
    }
  }
  const savedPaths = LearningPathCollection.find({ _id: { $in: savedPathsIDs } }).fetch();

  return {
    loading: !subscription.ready(),
    user,
    createdPaths,
    savedPaths,
    userForUserNameOnPage,
  };
}, UserView);

export { UserView as UserViewTest };
