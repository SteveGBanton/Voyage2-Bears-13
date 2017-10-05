import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

export default class MySavedPaths extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { loading, learningPathList, history, user } = this.props;
    return (
        (!loading) ?
          <div className="create-path">

            {/* TODO

             Display all Paths user has saved using RenderLearningPathList component.

             <RenderLearningPathList
               learningPathList={learningPathList}
               user={user}
             />

            */}

          </div>
          : ''
    );
  }
}

// TODO edit proptypes
MySavedPaths.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathList: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  // Get Ids of paths user has saved from user object, add to local array using:
  // const savedIds = Object.keys(user.savedLearningPaths);
  // Get each learning path object from DB.

  return {
    // learningPathList: learningPathList
  };
}, MySavedPaths);
