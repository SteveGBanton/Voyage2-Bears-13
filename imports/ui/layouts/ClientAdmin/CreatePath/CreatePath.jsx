import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import LearningPathEditor from '../../../components/LearningPathEditor/LearningPathEditor';

export default class CreatePath extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { history } = this.props;
    return (
      <div className="create-path">
        <h1>Create A Learning Path</h1>

        <LearningPathEditor history={history} />

      </div>
    );
  }
}

CreatePath.propTypes = {
  history: PropTypes.object.isRequired,
};
