import React from 'react';
import PropTypes from 'prop-types';

import LearningPathEditor from '../../../components/LearningPathEditor/LearningPathEditor';

const CreatePath = ({ history }) => (
  <div className="create-path">
    <h1>Create A Learning Path</h1>
    <LearningPathEditor history={history} />
  </div>
    );

CreatePath.propTypes = {
  history: PropTypes.object.isRequired,
};

export default CreatePath;
