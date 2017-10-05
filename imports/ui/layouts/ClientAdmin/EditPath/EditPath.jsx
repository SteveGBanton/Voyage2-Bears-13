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
        (!loading) ?
          <div className="create-path">

            {/* TODO

              Form To Edit Paths

              Call

              <LearningPathEditor learningPath={}/>

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

  return {
    // learningPathDoc: learningPathDoc
  };
}, EditPath);
