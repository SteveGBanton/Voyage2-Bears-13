import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class MyPaths extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { loading, learningPathList, history, user } = this.props;
    return (
        (!loading) ?
          <div className="my-paths">
            <h1>Edit Learning Paths You've Created</h1>

            

            {/* TODO

             Display all Paths user has created using RenderLearningPathList component.

             Buttons to edit etc.

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
MyPaths.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathList: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  // Load all paths user has created from DB.
  // call subscription that only allows us to see the learning paths from this userId.
  // Each learning path should have an ownerId property on it.

  return {
    // learningPathList: learningPathList
  };
}, MyPaths);
