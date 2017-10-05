import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

const LearningPathView = ({ loading, learningPathDoc, history, isUserOwner }) => (
  !loading ?
    <div className="learning-path-view">

      {/* TODO add edit button to go to edit page for this path if user is owner.

      {(isUserOwner) ?
        <RaisedButton
          onClick={() => history.push(`/learning-paths/edit/${doc._id}`)}
          style={{margin: "10px"}}
        >
          Edit
        </RaisedButton>
      : ''
      } */}

      {/* TODO
        Pass Learning Path document to Render Resources Component to be rendered:

        <RenderResources learningPath={learningPath} />
      */}

    </div>
  : <Loading />
);

// TODO edit proptypes
LearningPathView.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  // const learningPathId = match.params.learningPathId;
  // const subscription = Meteor.subscribe('learningPaths.viewOne', learningPathId);
  // const learningPath = LearningPaths.findOne(documentId)

  return {
    // loading: !subscription.ready(),
    // learningPathDoc: learningPath,
    // isUserOwner: (!!learningPath.owner)
  };
}, LearningPathView);
