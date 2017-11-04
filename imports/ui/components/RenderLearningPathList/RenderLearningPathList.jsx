import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { withTracker } from 'react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../Loading/Loading';
import SearchBar from '../SearchBar/SearchBar';
import LearningPathDetails from '../LearningPathDetails/LearningPathDetails';

import LearningPaths from '../../../api/LearningPath/LearningPath';

const DEFAULT_LIMIT = 30;
const FIND_ALL_OPTS = {
  sort: { aggregatedVotes: 'desc' },
  limit: DEFAULT_LIMIT,
};

class RenderLearningPathList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      /*
      filter: '',
      filteredList: [],
      */
      page: 1,
    };
  }

  loadMoreHandler() {
    Meteor.subscribe('learning-paths', this.props.defaultFilter, {
      ..._.pick(FIND_ALL_OPTS, 'sort'),
      limit: DEFAULT_LIMIT * (this.state.page + 1),
    });

    this.setState({
      page: this.state.page + 1,
    });
  }

  renderLearningPathList() {
    return this.props.learningPathList.map(lp => (
      <LearningPathDetails lp={lp} />
    ));
  }

  render() {
    const { loading } = this.props;

    return (
      <div className="lp-list-renderer">
        {/* TODO

          Renders a list of all Learning Path Names and descriptions passed in

          Mark if each learning path is saved using a check on the user.savedLearningPaths prop.

          Filter Options - Most Recent

          If user is ownerId (ownerId === user._id) on one of the learning paths in the list,
          add Edit button beside it.

          Link on each to go to the individual learning path view.

        */}
        {/* Let me know if you want this to be different */}
        <SearchBar />

        {
          !loading ?
            <div className="lp-list">{this.renderLearningPathList()}</div> :
            <Loading />
        }
        <RaisedButton label="Load More" disabled={loading} primary={!loading} />
      </div>
    );
  }
}

// TODO edit proptypes
RenderLearningPathList.propTypes = {
  defaultFilter: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  learningPathList: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
};

export default withTracker(({ filter }) => {
  const subscription = Meteor.subscribe('learning-paths', filter, FIND_ALL_OPTS);
  const learningPathList = LearningPaths.find({});

  return {
    defaultFilter: filter,
    loading: !subscription.ready(),
    learningPathList,
  };
});
