import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

export default class RenderLearningPathList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filter: '',
      filteredList: [],
    };
  }

  render() {
    const { history, learningPathList, user } = this.props;
    return (
      <div className="learning-path-list">

        {/* TODO

          Renders a list of all Learning Path Names and descriptions passed in

          Mark if each learning path is saved using a check on the user.savedLearningPaths prop.

          Filter Options - Most Recent

          If user is ownerId (ownerId === user._id) on one of the learning paths in the list, add Edit button beside it.

          Link on each to go to the individual learning path view.

        */}

      </div>
    );
  }

}

// TODO edit proptypes
RenderLearningPathList.propTypes = {

};
