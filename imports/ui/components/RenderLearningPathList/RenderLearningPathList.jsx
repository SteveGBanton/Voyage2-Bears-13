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
        {
          learningPathList.length > 0 ?
            this.renderLearningPathList() :
            <div className="lp-list-not-found">No matching paths found</div>
        }
      </ul>
    );
  }
}

RenderLearningPathList.defaultProps = {
  user: null,
  userId: null,
}
RenderLearningPathList.propTypes = {
  learningPathList: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      mentor: PropTypes.string.isRequired,
      mentorName: PropTypes.string.isRequired,
      skills: PropTypes.arrayOf(PropTypes.string).isRequired,
      thumbnail: PropTypes.string,
      aggregatedVotes: PropTypes.number.isRequired,
      voted: PropTypes.shape({}).isRequired,
    }),
  ).isRequired,
  userId: PropTypes.string,
  user: PropTypes.shape({}),
};
