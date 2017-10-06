import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

const Category = ({ loading, doc, history, categoryResults }) => (
  !loading ?
    <div className="category-page">
      <h1>Learning Path Category Page</h1>

      {/* TODO
        Pass list of all learning paths to RenderPaths component

        <RenderLearningPaths
          learningPathList={categoryResults}
          history={history}
        />
      */}

    </div>
  : <Loading />
);

// TODO edit proptypes
Category.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {

  // const categoryId = match.params.categoryId;
  // const subscription = Meteor.subscribe('learningPaths.viewCategory', categoryId);
  // const categoryResults = LearningPaths.find({category: })

  return {
    // loading: !subscription.ready(),
    // categoryResults: categoryResults,
    // isUserOwner: (!!learningPath.owner)
  };
}, Category);
