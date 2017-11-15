import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';

import LearningPathCollection from '../../../../api/LearningPath/LearningPath';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class MySavedPaths extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { loading, savedPaths, user } = this.props;
    return (
      <div className="saved-paths">
        {console.log(loading)}
        <h1>Learning Paths You Have Saved</h1>

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
    );
  }
}

MySavedPaths.defaultProps = {
  savedPaths: [],
}
MySavedPaths.propTypes = {
  loading: PropTypes.bool.isRequired,
  savedPaths: PropTypes.arrayOf(PropTypes.shape({})),
  user: PropTypes.shape({}).isRequired,
};

export default createContainer(({ user }) => {

  const opts = { sort: ['aggregatedVotes', 'desc'], limit: 2 };

  const savedPathsIDs = [];
  const keys = Object.keys(user.savedLearningPaths)
  for (let i = 0; i < keys.length; i += 1) {
    if (user.savedLearningPaths[keys[i]] === true) {
      savedPathsIDs.push(keys[i]);
    }
  }
  const subscription = Meteor.subscribe('learning-paths', {}, opts);
  const savedPaths = LearningPathCollection.find({ _id: { $in: savedPathsIDs } }).fetch();

  return {
    loading: false,
    user,
    savedPaths,
    // learningPathList: learningPathList
  };
}, MySavedPaths);
