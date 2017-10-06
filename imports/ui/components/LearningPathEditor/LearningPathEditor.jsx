import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

class LearningPathEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      name: '',
      description: '',
    }
  }

  render() {
    const { learningPath, history, isUserOwner } = this.props;
    return (
      <div className="create-path">

        {/* TODO

          Analagous to DocumentEditor component.

          Form To Add OR Edit Paths

          Editing learning Path Name, description etc.

          And all Resources within that learning path.

          IF EDITING A DOC:

            Doc will be passed in to component.

            Current learning path resources are passed in as an array of objects.

            Form fields are created for each one, default values loaded into forms.

            a forEach function creates a form field for each of these, editable.

          IF CREATING NEW DOC

            Doc will NOT be passed in to component.

            Start by adding resource #1

            + button to add a new Resource

          Form validation to make sure everything is correct.

          Calls Meteor method to Add OR Update Learning Path in collection.

        */}

      </div>
    );
  }
}

// TODO edit proptypes
CreatePath.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPath: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
