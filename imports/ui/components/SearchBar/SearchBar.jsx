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
  margin: '10px',
};

export default class SearchBar extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchFocused: false,
      searchInput: '',
      searchFilter: 'title',
    };

    this.handleChangeSearchInput = this.handleChangeSearchInput.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleSearchFocus(toggle) {
    this.setState({ searchFocused: toggle });
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
        <h3>Search</h3>
        <div
          className={
            this.state.searchFocused ? "search-bar-InputWrap on" : "search-bar-InputWrap off"
          }
        >
          <input
            onFocus={() => this.toggleSearchFocus(true)}
            onBlur={() => this.toggleSearchFocus(false)}
            onChange={this.handleChangeSearchInput}
            value={this.state.searchInput}
            type="text"
            placeholder="⌕"
            className="search-bar-Input"
          />
        </div>
        {
          filterOpts.length > 0 ?
            <SelectField
              floatingLabelText="Filter"
              floatingLabelStyle={FILTER_MENU_STYLE}
              labelStyle={FILTER_MENU_STYLE}
              value={this.state.searchFilter}
              onChange={this.handleMenuSelect}
            >
              {this.renderFilterOpts()}
            </SelectField> :
            null
        }

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
