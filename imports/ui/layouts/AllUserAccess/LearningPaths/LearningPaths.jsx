import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class LearningPaths extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
        (!loading) ?
          <div className="all-learning-paths">

            {/* TODO Create learning path categories  */}

            {/* TODO Add categories users can browse */}

          </div>
          : ''
    );
  }
}

// TODO edit proptypes
LearningPathView.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  //
  // const subscription = Meteor.subscribe('learningPaths.viewOne', learningPathId);
  // const learningPath = LearningPaths.findOne(documentId)

  return {
    // loading: !subscription.ready(),
    // doc: learningPath,
    // isUserOwner: (!!learningPath.owner)
  };
}, LearningPathView);
