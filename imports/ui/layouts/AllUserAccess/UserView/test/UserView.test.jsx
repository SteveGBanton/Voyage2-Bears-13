/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import sinon from 'sinon';
import jsxChai from 'jsx-chai';

chai.use(jsxChai);

if (Meteor.isClient) {
  import { UserViewTest } from '../UserView';

  describe('UserView.jsx', function () {
    it('should render when user valid', function () {
      const renderer = TestUtils.createRenderer();
      const userForUserNameOnPage = {
        username: 'test-username',
      };
      renderer.render(<UserViewTest loading={false} history={{}} userForUserNameOnPage={userForUserNameOnPage} />);
      const actual = renderer.getRenderOutput();

      const expected = (
        <h2>Recent Learning Paths Created</h2>
      );

      expect(actual).to.include(expected);
    });

    it('should render a valid username on the page', function () {
      const renderer = TestUtils.createRenderer();
      const userForUserNameOnPage = {
        username: 'test-username',
      };
      renderer.render(<UserViewTest loading={false} history={{}} userForUserNameOnPage={userForUserNameOnPage} />);
      const actual = renderer.getRenderOutput();

      const expected = 'test-username';

      expect(actual).to.include(expected);
    });

    it('should render no user message if username does not exist', function () {
      const renderer = TestUtils.createRenderer();
      const userForUserNameOnPage = undefined;

      renderer.render(<UserViewTest loading={false} history={{}} userForUserNameOnPage={userForUserNameOnPage} />);
      const actual = renderer.getRenderOutput();

      const expected = 'Sorry, cannot find user.';

      expect(actual).to.include(expected);
    });
  });
}

