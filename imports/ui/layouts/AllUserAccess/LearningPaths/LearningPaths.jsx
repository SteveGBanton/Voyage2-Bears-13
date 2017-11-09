import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import RenderLearningPathList from '../../../components/RenderLearningPathList/RenderLearningPathList';
import SearchBar from '../../../components/SearchBar/SearchBar';
import Loading from '../../../components/Loading/Loading';

import { default as LearningPathCollection } from '../../../../api/LearningPath/LearningPath';

const FILTER_OPTIONS = ['title', 'description', 'skills'];
const DEFAULT_LIMIT = 30;
const FIND_ALL_OPTS = {
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
    const { loading, learningPathList, filterOpts, location, history } = this.props;
    return (
      <div className="learning-paths">
        {/* TODO Create learning path categories  */}

        {/* TODO Add categories users can browse */}
        <SearchBar
          loading={loading}
          filterOpts={filterOpts}
          location={location}
          history={history}
        />

        {
          !loading ?
            <RenderLearningPathList learningPathList={learningPathList} /> :
            <Loading />
        }

        <RaisedButton
          label="Load More"
          disabled={loading}
          primary={!loading}
          onClick={this.loadMoreHandler}
        />
      </div>
    );
  }
}

// TODO edit proptypes
LearningPaths.propTypes = {
  loading: PropTypes.bool.isRequired,
  learningPathList: PropTypes.arrayOf(
    PropTypes.shape({}),
  ).isRequired,
  selector: PropTypes.shape({}).isRequired,
  filterOpts: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({}).isRequired,
};

function parseQueryString(search) {
  const QUERY_REG_EXP = new RegExp(`(?:${FILTER_OPTIONS.join('|')})=[A-Za-z0-9 ]+`);
  let query = search.match(QUERY_REG_EXP);
  console.log(query);
  if (!query) return null;

  query = _.head(query).split('=');
  if (query[0] !== 'skills') return { [query[0]]: { $regex: new RegExp(query[1], 'i') } };
  return { [query[0]]: { $elemMatch: { $regex: new RegExp(query[1], 'i') } } };
}

export default createContainer(({ location, history }) => {
  const search = location.search;
  let selector = {};
  const query = parseQueryString(search);
  if (query) {
    selector = query;
  }

  const subscription = Meteor.subscribe('learning-paths', selector, FIND_ALL_OPTS);
  const learningPathList = LearningPathCollection.find().fetch();

  return {
    loading: !subscription.ready(),
    learningPathList,
    selector,
    filterOpts: FILTER_OPTIONS,
    location,
    history,
  };
}, LearningPaths);
