import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';
import Loading from '../../../components/Loading/Loading';

export default class LearningPaths extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    // const { loading, doc, history, isUserOwner } = this.props;
    return (
      <div className="learning-paths">
        {/* TODO Create learning path categories  */}

        {/* TODO Add categories users can browse */}
        <RenderLearningPathList filter={{}} />
      </div>
    );
  }
}

// TODO edit proptypes
LearningPaths.propTypes = {
  // loading: PropTypes.bool.isRequired,
  // doc: PropTypes.object,
  // match: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired,
};

/*
export default withTracker(({ match }) => {
  //
  // const subscription = Meteor.subscribe('learningPaths.viewOne', learningPathId);
  // const learningPath = LearningPaths.findOne(documentId)

  return {
    // loading: !subscription.ready(),
    // doc: learningPath,
    // isUserOwner: (!!learningPath.owner)
  };
}, LearningPaths);
*/
