import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

class CreatePath extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resources = [],
      name = '',
      description = '',
    }
  }

  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
        (!loading) ?
          <div className="create-path">

            {/* TODO
              Form To Create Paths

              Learning Path Name, description etc.

              Start by adding resource #1

              + button to add a new Resource

              Form validation to make sure everything is correct.

              Calls Meteor method to add to collection.

            */}

          </div>
          : ''
    );
  }
}

// TODO edit proptypes
CreatePath.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
