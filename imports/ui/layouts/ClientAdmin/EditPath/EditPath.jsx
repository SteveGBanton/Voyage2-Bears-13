import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

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

// TODO edit proptypes
EditPath.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathDoc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};


export default createContainer(({ match }) => {
  // const subscriptionAll = Meteor.subscribe('learning-paths');
  // console.log(LearningPaths.find({}).fetch());

  const pathId = match.params.learningPathId;
  const subscription = Meteor.subscribe('learning-paths.view', pathId);
  const learningPathDoc = LearningPaths.findOne(pathId);

  return {
    loading: !subscription.ready(),
    learningPathDoc,
  };
}, EditPath);
