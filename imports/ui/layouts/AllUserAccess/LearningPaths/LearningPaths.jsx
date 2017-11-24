import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Loading from '../../../components/Loading/Loading';

import { default as LearningPathCollection } from '../../../../api/LearningPath/LearningPath';

if (Meteor.isClient) import './LearningPaths.scss';

export const FILTER_OPTIONS = ['title', 'description', 'skills'];
const DEFAULT_LIMIT = 30;
export const FIND_ALL_OPTS = {
  sort: ['aggregatedVotes', 'desc'],
  limit: DEFAULT_LIMIT,
};

class LearningPaths extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
    };

    this.loadMoreHandler = this.loadMoreHandler.bind(this);
  }

  loadMoreHandler() {
    const { selector } = this.props;
    Meteor.subscribe('learning-paths', selector, {
      ..._.pick(FIND_ALL_OPTS, 'sort'),
      limit: DEFAULT_LIMIT * (this.state.page + 1),
    });
    this.setState({
      page: this.state.page + 1,
    });
  }

  render() {
    const { loading, learningPathList, filterOpts, location, history, user, userId, subscription } = this.props;
    return (
      <div className="LearningPaths">
        <div className="LearningPaths-header">
          <SearchBar
            loading={loading}
            filterOpts={filterOpts}
            location={location}
            history={history}
            subscription={subscription}
          />
        </div>
        {
          !loading ?
            <RenderLearningPathList
              learningPathList={learningPathList}
              user={user}
              userId={userId}
            /> :
            <Loading />
        }

        <div className="LearningPaths-btn-panel">
          <RaisedButton
            className="LearningPaths-load-more-btn"
            label="Load More"
            disabled={loading}
            primary={!loading}
            onClick={this.loadMoreHandler}
            style={{ margin: 30 }}
          />
        </div>
      </div>
    );
  }
}

LearningPaths.defaultProps = {
  user: null,
  userId: null,
  learningPathList: null,
  selector: null,
  loading: true,
  filterOpts: FILTER_OPTIONS,
};

LearningPaths.propTypes = {
  loading: PropTypes.bool,
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
  ),
  selector: PropTypes.shape({}),
  filterOpts: PropTypes.arrayOf(PropTypes.string),
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
  user: PropTypes.shape({}),
  userId: PropTypes.string,
};

function parseQueryString(search) {
  const QUERY_REG_EXP = new RegExp(`(?:${FILTER_OPTIONS.join('|')})=[A-Za-z0-9 ]+`);
  let query = search.match(QUERY_REG_EXP);
  if (!query) return null;

  query = _.head(query).split('=');
  if (query[0] !== 'skills') return { [query[0]]: { $regex: new RegExp(query[1], 'i') } };
  return { [query[0]]: { $elemMatch: { $regex: new RegExp(query[1], 'i') } } };
}

export default createContainer(({ location, history, user }) => {

  const search = location.search;
  let selector = {};
  const query = parseQueryString(search);
  if (query) {
    selector = query;
  }

  const subscription = Meteor.subscribe('learning-paths', selector, FIND_ALL_OPTS);
  const learningPathList = LearningPathCollection.find(selector).fetch();

  const userId = (user) ? user._id : null;

  return {
    subscription,
    loading: !subscription.ready(),
    learningPathList,
    selector,
    filterOpts: FILTER_OPTIONS,
    location,
    history,
    user,
    userId,
  };
}, LearningPaths);

export { LearningPaths as LearningPathsTest };
