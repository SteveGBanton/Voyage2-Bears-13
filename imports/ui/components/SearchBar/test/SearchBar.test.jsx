/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import jsxChai from 'jsx-chai';
import sinon from 'sinon';
import _ from 'lodash';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

chai.use(jsxChai);

import SearchBar, { FILTER_MENU_STYLE, BUTTON_STYLE } from '../SearchBar';

if (Meteor.isClient) {
  describe('SearchBar.jsx', function () {
    let defaultProps = {
      loading: false,
      filterOpts: ['title', 'description', 'skills'],
      location: {
        pathname: '/learning-paths',
        search: '',
      },
      history: {
        push: function push() {},
      },
    };

    const component = (
      <SearchBar {...defaultProps} />
    );

    it('should render', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(component);
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = (
        <h1>Search</h1>
      );

      expect(actual).to.include(expected);
    });

    it('should render a MenuItem title if filter option for title', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(component);
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = 'Title';

      expect(actual).to.include(expected);
    });

    it('should not render a SelectField if there are no filter options', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <SearchBar
          filterOpts={[]}
          {..._.omit(defaultProps, 'filterOpts')}
        />,
      );
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = (
        <SelectField
          floatingLabelText="Filter"
          floatingLabelStyle={FILTER_MENU_STYLE}
          labelStyle={FILTER_MENU_STYLE}
          value={instance.state.searchFilter}
          onChange={instance.handleMenuSelect}
        />
      );

      expect(actual).not.to.include(expected);
    });

    it('should render a disabled Search button when loading', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <SearchBar
          loading
          {..._.omit(defaultProps, 'loading')}
        />,
      );
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = (
        <RaisedButton
          className="search-bar-Search-btn"
          label="Search"
          disabled
          primary={false}
          onClick={instance.handleSubmit}
          style={BUTTON_STYLE}
        />
      );

      expect(actual).to.include(expected);
    });

    it('should render a disabled Clear button when loading', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <SearchBar
          loading
          {..._.omit(defaultProps, 'loading')}
        />,
      );
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = (
        <RaisedButton
          className="search-bar-Clear-btn"
          label="Clear"
          disabled
          primary={false}
          onClick={instance.handleClear}
          style={BUTTON_STYLE}
        />
      );

      expect(actual).to.include(expected);
    });

    it('should change the state of searchInput when input element changes', function () {
      const testDoc = TestUtils.renderIntoDocument(
        <MuiThemeProvider>
          {component}
        </MuiThemeProvider>,
      );
      const instance = TestUtils.findRenderedComponentWithType(testDoc, SearchBar);
      const inputElement = TestUtils.findRenderedDOMComponentWithTag(testDoc, 'input');
      inputElement.value = 'hello world';
      TestUtils.Simulate.change(inputElement);
      expect(instance.state.searchInput).to.equal('hello world');
    });

    it('should redirect to query when search button is clicked with contents in input field', function () {
      const history = { push: () => {} };
      const historyStub = sinon.stub(history, 'push');
      const props = { ..._.omit(defaultProps, ['history']), history };
      props.subscription = {
        stop: () => {},
      };
      const testDoc = TestUtils.renderIntoDocument(
        <MuiThemeProvider>
          <SearchBar {...props} />
        </MuiThemeProvider>,
      );
      const inputElement = TestUtils.findRenderedDOMComponentWithTag(testDoc, 'input');
      const searchBtn = TestUtils.scryRenderedDOMComponentsWithTag(testDoc, 'button')[1];

      inputElement.value = 'hello';
      TestUtils.Simulate.change(inputElement);
      TestUtils.Simulate.click(searchBtn);
      sinon.assert.calledWith(historyStub, `/learning-paths?title=hello`);

      historyStub.restore();
    });

    it('should redirect without a query when search button is clicked  with no contents in input field', function () {
      const history = { push: () => {} };
      const historyStub = sinon.stub(history, 'push');
      const props = { ..._.omit(defaultProps, ['history']), history };
      props.subscription = {
        stop: () => { },
      };
      const testDoc = TestUtils.renderIntoDocument(
        <MuiThemeProvider>
          <SearchBar {...props} />
        </MuiThemeProvider>,
      );
      const searchBtn = TestUtils.scryRenderedDOMComponentsWithTag(testDoc, 'button')[1];

      TestUtils.Simulate.click(searchBtn);
      sinon.assert.calledWith(historyStub, `/learning-paths`);

      historyStub.restore();
    });

    it('should clear searchInput when clear button is clicked', function () {
      const testDoc = TestUtils.renderIntoDocument(
        <MuiThemeProvider>
          {component}
        </MuiThemeProvider>,
      );
      const instance = TestUtils.findRenderedComponentWithType(testDoc, SearchBar);
      const inputElement = TestUtils.findRenderedDOMComponentWithTag(testDoc, 'input');
      const clearBtn = TestUtils.scryRenderedDOMComponentsWithTag(testDoc, 'button')[2];

      inputElement.value = 'hello';
      TestUtils.Simulate.change(inputElement);
      TestUtils.Simulate.click(clearBtn);
      expect(instance.state.searchInput).to.equal('');
    });
  });
}
