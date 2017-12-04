/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import jsxChai from 'jsx-chai';
import _ from 'lodash';

if (Meteor.isClient) {
  import RenderLearningPathList from '../RenderLearningPathList';
  import LearningPathDetails from '../../LearningPathDetails/LearningPathDetails';

  import { generateLearningPathDataList } from '../../../../modules/test-helpers';

  chai.use(jsxChai);


  describe('RenderLearningPathList.jsx', function () {
    const user = { savedLearningPaths: [] };
    const userId = Random.id();
    const learningPathList = generateLearningPathDataList(userId, false);

    const defaultProps = {
      learningPathList,
      user,
      userId,
    };

    const component = (
      <RenderLearningPathList {...defaultProps} />
    );

    it('should render', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(component);
      const actual = renderer.getRenderOutput();

      const expected = `ul className="lp-list"`;
      expect(actual).to.include(expected);
    });

    it('should render a list of LearningPathDetails components', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(component);
      const actual = renderer.getRenderOutput();

      const expected = (
        <li>
          <LearningPathDetails lp={learningPathList[0]} user={user} userId={userId} />
        </li>
      );
      expect(actual).to.include(expected);
    });

    it('should not render a list if given an empty array for learningPathList prop', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <RenderLearningPathList
          learningPathList={[]}
          {..._.pick(defaultProps, ['user', 'userId'])}
        />
      );
      const actual = renderer.getRenderOutput();

      const expected = (
        <div className="lp-list-not-found">No matching paths found</div>
      );
      expect(actual).to.include(expected);
    });
  });
}
