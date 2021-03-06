/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random'
import { Bert } from 'meteor/themeteorchef:bert';
import { expect } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import jsxChai from 'jsx-chai';
import sinon from 'sinon';
import _ from 'lodash';

import Chip from 'material-ui/Chip';
import { green500, red500 } from 'material-ui/styles/colors';
import { Link } from 'react-router-dom';

if (Meteor.isClient) import LearningPathDetails, { DEFAULT_THUMBNAIL } from '../LearningPathDetails';

import { learningPathsUpvote, learningPathsDownvote } from '../../../../api/LearningPath/methods';

import { generateLearningPathData, getTestDoc } from '../../../../modules/test-helpers';

chai.use(jsxChai);

const ERROR_MSG = 'This is a Bert alert';

if (Meteor.isClient) {
  describe('LearningPathDetails.jsx', function () {
    const user = { savedLearningPaths: [] };
    const userId = Random.id();
    const lp = generateLearningPathData(userId, false);

    const defaultProps = {
      lp,
      user,
      userId,
    };

    const lpComponent = (<LearningPathDetails {...defaultProps} />);

    it('should render', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(lpComponent);
      const actual = renderer.getRenderOutput();

      const expected = 'favorite';

      expect(actual).to.include(expected);
    });

    it('should have a link to the appropriate LearningPath view', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(lpComponent);
      const actual = renderer.getRenderOutput();

      const expected = `to="/learning-path/${lp._id}"`;

      expect(actual).to.include(expected);
    });

    it('should render a default thumbnail if no thumbnail is provided', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <LearningPathDetails
          lp={generateLearningPathData(userId, false, { thumbnail: DEFAULT_THUMBNAIL })}
          {..._.pick(defaultProps, ['user', 'userId'])}
        />,
      );
      const actual = renderer.getRenderOutput();

      const expected = DEFAULT_THUMBNAIL;

      expect(actual).to.include(expected);
    });

    it('should render a saved icon if user has path saved', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(
        <LearningPathDetails
          user={{ savedLearningPaths: { [lp._id]: true } }}
          {..._.pick(defaultProps, ['lp', 'userId'])}
        />,
      );
      const actual = renderer.getRenderOutput();

      const expected = 'Saved';

      expect(actual).to.include(expected);
    });

    it('should render skills', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(lpComponent);
      const actual = renderer.getRenderOutput();

      const expected = (
        <div className="lp-skills">
          <Chip className="lp-skill" key="skill-1" style={{ margin: 3 }}>
            js
          </Chip>
          <Chip className="lp-skill" key="skill-2" style={{ margin: 3 }}>
            css
          </Chip>
          <Chip className="lp-skill" key="skill-3" style={{ margin: 3 }}>
            react-js
          </Chip>
        </div>
      );

      expect(actual).to.include(expected);
    });

    it('should color the upvote button green if user upvoted', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(<LearningPathDetails
        lp={generateLearningPathData(userId, false, {
          aggregatedVotes: 1,
          voted: { [userId]: 1 },
        })}
        {..._.pick(defaultProps, ['user', 'userId'])}
      />,
      );
      const lpInstance = renderer._instance._instance;

      const actual = renderer.getRenderOutput();

      const expected = green500;
      expect(actual).to.include(expected);
    });

    it('should color the downvote button red if user downvoted', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(<LearningPathDetails
        lp={generateLearningPathData(userId, false, {
          aggregatedVotes: -1,
          voted: { [userId]: -1 },
        })}
        {..._.pick(defaultProps, ['user', 'userId'])}
      />,
      );
      const lpInstance = renderer._instance._instance;

      const actual = renderer.getRenderOutput();

      const expected = red500;

      expect(actual).to.include(expected);
    });

    it('should render a link to the mentor user page', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(lpComponent);

      const actual = renderer.getRenderOutput();

      const expected = (
        <Link to={`/user/${lp.mentorName}`}>{lp.mentorName}</Link>
      );
      expect(actual).to.include(expected);
    });

    it('should render an Edit button if user is the mentor', function () {
      const renderer = TestUtils.createRenderer();

      renderer.render(<LearningPathDetails
        lp={generateLearningPathData(userId, true, { _id: lp._id })}
        {..._.pick(defaultProps, ['user', 'userId'])}
      />);

      const actual = renderer.getRenderOutput();

      const expected = (
        <Link className="lp-edit-link" to={`/learning-path/${lp._id}/edit`}>edit</Link>
      );
      expect(actual).to.include(expected);
    });

    it('should call learningPathsUpvote with lpId when upvote button is clicked', function () {
      const upvoteStub = sinon.stub(learningPathsUpvote, 'call');

      const testDoc = TestUtils.renderIntoDocument(getTestDoc(lpComponent));

      const upvoteBtn = TestUtils.findRenderedDOMComponentWithClass(testDoc, 'lp-vote-btn lp-upvote');
      TestUtils.Simulate.click(upvoteBtn);

      sinon.assert.calledWith(upvoteStub, _.pick(lp, '_id'));

      upvoteStub.restore();
    });

    it('should call Bert.alert if upvote is clicked and error is thrown', function () {
      const upvoteStub = sinon.stub(learningPathsUpvote, 'call');
      upvoteStub.throws(new Meteor.Error(null, ERROR_MSG));

      const bertStub = sinon.stub(Bert, 'alert');

      const testDoc = TestUtils.renderIntoDocument(getTestDoc(lpComponent));

      const upvoteBtn = TestUtils.findRenderedDOMComponentWithClass(testDoc, 'lp-vote-btn lp-upvote');
      TestUtils.Simulate.click(upvoteBtn);

      sinon.assert.calledWith(bertStub, {
        message: ERROR_MSG,
        type: 'alert',
        icon: 'fa-ban',
      });

      upvoteStub.restore();
      bertStub.restore();
    });

    it('should call learningPathsDownvote with lpId when downvote button is clicked', function () {
      const downvoteStub = sinon.stub(learningPathsDownvote, 'call');

      const testDoc = TestUtils.renderIntoDocument(getTestDoc(lpComponent));

      const downvoteBtn = TestUtils.findRenderedDOMComponentWithClass(testDoc, 'lp-vote-btn lp-downvote');
      TestUtils.Simulate.click(downvoteBtn);

      sinon.assert.calledWith(downvoteStub, _.pick(lp, '_id'));

      downvoteStub.restore();
    });

    it('should call Bert.alert if downvote is clicked and error is thrown', function () {
      const downvoteStub = sinon.stub(learningPathsDownvote, 'call');
      downvoteStub.throws(new Meteor.Error(null, ERROR_MSG));

      const bertStub = sinon.stub(Bert, 'alert');

      const testDoc = TestUtils.renderIntoDocument(getTestDoc(lpComponent));

      const downvoteBtn = TestUtils.findRenderedDOMComponentWithClass(testDoc, 'lp-vote-btn lp-downvote');
      TestUtils.Simulate.click(downvoteBtn);

      sinon.assert.calledWith(bertStub, {
        message: ERROR_MSG,
        type: 'alert',
        icon: 'fa-ban',
      });

      downvoteStub.restore();
      bertStub.restore();
    });
  });
}
