import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../components/Loading/Loading';

export default class RenderResources extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      resources: [],
    }
  }

  handleSearch() {
    // TODO handle on-page search here.
  }

  render() {
    const { loading, history, learningPath } = this.props;
    return (
        (!loading) ?
          <div className="render-resources">

            {/* TODO Renders a list of all Resources in passed in Learning Path.

              Search option - on-page quick search box - only display Resource containing string.

              Link on each to go to the individual resource view:
              /learning-paths/:learningPathId/resource/:resourceId

            */}

          </div>
          : ''
    );
  }

}

// TODO edit proptypes
RenderResources.propTypes = {

};
