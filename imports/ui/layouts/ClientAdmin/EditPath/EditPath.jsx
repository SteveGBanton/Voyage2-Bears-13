import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class EditPath extends React.Component {

  constructor(props) {
    super(props);

  }

  render() {
    const { loading, learningPathDoc, history, isUserOwner } = this.props;
    return (
      // Make sure user owns document, or else cannot edit it.
        (!loading && isUserOwner) ?
          <div className="edit-path">
            <h1>Edit A Learning Path</h1>

            {/* TODO

              Form To Edit Paths

              Call:

              <LearningPathEditor learningPath={learningPathDoc}/>

            */}

          </div>
          : ''
    );
  }
}

// TODO edit proptypes
EditPath.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathDoc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};


export default createContainer(({ match }) => {

  // Load document to edit from DB using URL.
  // /learning-path/:learningPathId/edit
  // Also determine whether user is owner of the doc.

  return {
    // learningPathDoc: learningPathDoc,
    // isUserOwner: isUserOwner,
  };
}, EditPath);
