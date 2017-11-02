import React from 'react';
import PropTypes from 'prop-types';
import { Random } from 'meteor/random';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';
import LearningPathDetails from '../../../components/LearningPathDetails/LearningPathDetails';

class LearningPaths extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
        (!loading) ?
          <div className="all-learning-paths">
            <h1>All Learning Paths</h1>

            {/* TODO Create learning path categories  */}
            <LearningPathDetails
            lp={{
              _id: Random.id(),
              title: 'Example title',
              mentor: Random.id(),
              description: 'This is a long long long long long long long long long long long long long long long long long long long description for this learning path',
              thumbnail: 'https://cdn.pixabay.com/photo/2017/10/26/20/00/pumpkin-2892303_960_720.jpg',
              aggregatedVotes: 0,
            }} />
            {/* TODO Add categories users can browse */}

          </div>
          : ''
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

export default createContainer(({ match }) => {

  //
  // const subscription = Meteor.subscribe('learningPaths.viewOne', learningPathId);
  // const learningPath = LearningPaths.findOne(documentId)

  return {
    // loading: !subscription.ready(),
    // doc: learningPath,
    // isUserOwner: (!!learningPath.owner)
  };
}, LearningPaths);
