import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

if (Meteor.isClient) import './SearchBar.scss';

export const FILTER_MENU_STYLE = {
  color: 'white',
  textAlign: 'left',
};
export const BUTTON_STYLE = {
  margin: '10px 0 10px 20px',
};

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchFocused: true,
      searchInput: '',
      searchFilter: 'title',
    };

    this.handleChangeSearchInput = this.handleChangeSearchInput.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleSearchFocus(toggle) {
    // this.setState({ searchFocused: toggle });
  }

  handleChangeSearchInput(e) {
    this.setState({ searchInput: e.target.value });
  }

  handleMenuSelect(e, index, value) {
    this.setState({ searchFilter: value });
  }

  handleClear() {
    this.setState({
      searchInput: '',
    });
  }

  handleSubmit() {
    this.props.subscription.stop();
    const { history, location } = this.props;
    if (this.state.searchInput.length > 0) {
      history.push(`${location.pathname}?${this.state.searchFilter}=${this.state.searchInput}`);
    } else {
      history.push(location.pathname);
    }
  }

  renderFilterOpts() {
    const { filterOpts } = this.props;
    return filterOpts.map(menuItem => (
      <MenuItem
        key={menuItem}
        value={menuItem}
        primaryText={_.capitalize(menuItem)}
      />
    ));
  }

  render() {
    const { loading, filterOpts } = this.props;
    return (
      <div className="search-bar">
        <h1>Search</h1>
          <input
            onFocus={() => this.toggleSearchFocus(true)}
            onChange={this.handleChangeSearchInput}
            value={this.state.searchInput}
            type="text"
            placeholder="⌕"
            className="search-bar-Input"
          />
        <div className="search-options">
          {
            filterOpts.length > 0 ?
              <SelectField
                className="select-field"
                floatingLabelText="Search By:"
                floatingLabelStyle={{ color: '#FFFFFF' }}
                labelStyle={FILTER_MENU_STYLE}
                value={this.state.searchFilter}
                onChange={this.handleMenuSelect}
                style={{ width: 150 }}
              >
                {this.renderFilterOpts()}
              </SelectField>
              :
              null
          }
          <div>
            <RaisedButton
              className="search-bar-Search-btn"
              label="Search"
              disabled={loading}
              primary={!loading}
              onClick={this.handleSubmit}
              style={BUTTON_STYLE}
            />
            <RaisedButton
              className="search-bar-Clear-btn"
              label="Clear"
              disabled={loading}
              secondary={!loading}
              onClick={this.handleClear}
              style={BUTTON_STYLE}
            />
          </div>
        </div>
      </div>
    );
  }
}
// TODO edit proptypes

SearchBar.propTypes = {
  loading: PropTypes.bool.isRequired,
  filterOpts: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
