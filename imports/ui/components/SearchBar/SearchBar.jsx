import React from 'react';
import PropTypes from 'prop-types';

import RaisedButton from 'material-ui/RaisedButton';


export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);
  }

  handleSubmit() {
    //
  }

  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
      <div className="search-bar">
        {/* TODO Search form
          allow search by Username / Learning Path Name / Description / Category
        */}
      </div>
    );
  }

}
// TODO edit proptypes
SearchBar.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
