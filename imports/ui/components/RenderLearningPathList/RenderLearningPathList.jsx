import React from 'react';
import PropTypes from 'prop-types';

import LearningPathDetails from '../LearningPathDetails/LearningPathDetails';

import './RenderLearningPathList.scss';

export default class RenderLearningPathList extends React.Component {
  renderLearningPathList() {
    const { learningPathList, user, userId } = this.props;
    return learningPathList.map(lp => (
      <li key={lp._id}><LearningPathDetails lp={lp} user={user} userId={userId} /></li>
    ));
  }

  render() {
    const { learningPathList } = this.props;

    return (
      <ul className="lp-list">
        {/* TODO

          Renders a list of all Learning Path Names and descriptions passed in

          Mark if each learning path is saved using a check on the user.savedLearningPaths prop.

          Filter Options - Most Recent

          If user is ownerId (ownerId === user._id) on one of the learning paths in the list,
          add Edit button beside it.

          Link on each to go to the individual learning path view.

        */}
        {
          learningPathList.length > 0 ?
            this.renderLearningPathList() :
            <div className="lp-list-not-found">No matching paths found</div>
        }
      </ul>
    );
  }
}

// TODO edit proptypes
RenderLearningPathList.propTypes = {
  learningPathList: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  userId: PropTypes.string.isRequired,
  user: PropTypes.shape({}).isRequired,
};
