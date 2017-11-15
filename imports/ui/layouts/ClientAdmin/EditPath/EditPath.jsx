import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import LearningPaths from '../../../../api/LearningPath/LearningPath';
import Loading from '../../../components/Loading/Loading';
import LearningPathEditor from '../../../components/LearningPathEditor/LearningPathEditor';

const EditPath = ({ loading, learningPathDoc, history }) => (
  (!loading) ?
    <div className="edit-path">
      <h1>Edit A Learning Path</h1>

      {(learningPathDoc && learningPathDoc.mentor === Meteor.userId()) ?
        <LearningPathEditor path={learningPathDoc} history={history} />
        :
        'Sorry, only the creator can edit this Learning Path.'
      }

    </div>
    :
    <Loading />
);

EditPath.defaultProps = {
  learningPathDoc: {},
};

EditPath.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathDoc: PropTypes.shape({}),
  history: PropTypes.shape({}).isRequired,
};

export default createContainer(({ match }) => {
  const pathId = match.params.learningPathId;
  const subscription = Meteor.subscribe('learning-paths.view', pathId);
  const learningPathDoc = LearningPaths.findOne(pathId);
  return {
    loading: !subscription.ready(),
    learningPathDoc,
  };
}, EditPath);
