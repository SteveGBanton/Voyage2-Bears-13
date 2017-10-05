import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

const ResourceDetailView = ({ loading, resourceDoc, history }) => (
  !loading ?
    <div className="learning-path-view">

      {/* TODO

        Render one Resource on the page.

        Resource is in a learning Path. Display only the Id in the browser parameter.
        eg
        /learning-path/:learningPathId/resource/:resourceId

      */}

    </div>
  : <Loading />
);

// TODO edit proptypes
ResourceDetailView.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  // Get the single resource by pulling learning path from DB and getting resource object.
  //
  // Get learning path id, then get resource id
  // /learning-path/:learningPathId/resource/:resourceId
  //
  // const learningPathId = match.params.learningPathId;
  // const resourceId = match.params.resourceId;
  // const subscription = Meteor.subscribe('learningPaths.viewOne', learningPathId);
  // const learningPath = LearningPaths.findOne(documentId)
  //
  // const resourceDoc = learningPath.resources.filter((obj) => {
  //   return obj._id === resourceId;
  // })

  return {
    // resourceDoc: resourceDoc
  };
}, ResourceDetailView);
