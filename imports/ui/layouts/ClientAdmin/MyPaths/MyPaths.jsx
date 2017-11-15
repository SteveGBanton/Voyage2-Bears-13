import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';

import LearningPathCollection from '../../../../api/LearningPath/LearningPath';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class MyPaths extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { loading, createdPaths, user } = this.props;
    return (
      <div className="my-paths">
        <h1>Your Learning Paths</h1>
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
      </div>
    );
  }
}

MyPaths.defaultProps = {
  createdPaths: [],
};

MyPaths.propTypes = {
  loading: PropTypes.bool.isRequired,
  createdPaths: PropTypes.arrayOf(PropTypes.shape({})),
  user: PropTypes.shape({}).isRequired,
};

export default createContainer(({ user }) => {
  const opts = { sort: ['aggregatedVotes', 'desc'], limit: 500 };
  const subscription = Meteor.subscribe('learning-paths', { mentor: user._id }, opts);
  const createdPaths = LearningPathCollection.find({ mentor: user._id }).fetch();

  return {
    loading: !subscription.ready(),
    user,
    createdPaths,
  };
}, MyPaths);
