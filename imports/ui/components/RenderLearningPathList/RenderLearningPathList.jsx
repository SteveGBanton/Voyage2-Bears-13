import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../components/Loading/Loading';

export default class RenderLearningPathList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      filtered: '',
    }
  }

  render() {
    const { loading, history, learningPathList } = this.props;
    return (
        (!loading) ?
          <div className="learning-path-list">

            {/* TODO Renders a list of all Learning Path Names and descriptions

              Filter Options

              Link on each to go to the individual learning path view.
            */}

          </div>
          : ''
    );
  }

}

// TODO edit proptypes
RenderLearningPathList.propTypes = {

};
