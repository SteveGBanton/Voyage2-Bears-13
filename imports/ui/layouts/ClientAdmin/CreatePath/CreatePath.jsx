import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

export default class CreatePath extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
      <div className="create-path">
        <h1>Create A Learning Path</h1>

        {/* TODO

          Form To Create Paths

          Call

          <LearningPathEditor />

        */}

      </div>
    );
  }
}

// TODO edit proptypes
CreatePath.propTypes = {
  loading: PropTypes.bool.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
