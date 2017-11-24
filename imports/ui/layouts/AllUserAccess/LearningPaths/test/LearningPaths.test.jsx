/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */

import React from 'react';
import { Random } from 'meteor/random';
import { expect, assert } from 'meteor/practicalmeteor:chai';
import TestUtils from 'react-addons-test-utils';
import jsxChai from 'jsx-chai';
import sinon from 'sinon';
import _ from 'lodash';

import RaisedButton from 'material-ui/RaisedButton';

import LearningPaths, {
  LearningPathsTest,
  FILTER_OPTIONS,
  FIND_ALL_OPTS,
} from '../LearningPaths';
import RenderLearningPathList from '../../../../components/RenderLearningPathList/RenderLearningPathList';
import Loading from '../../../../components/Loading/Loading';

import { default as LearningPathCollection } from '../../../../../api/LearningPath/LearningPath';

import { generateLearningPathDataList, getTestDoc } from '../../../../../modules/test-helpers';

chai.use(jsxChai);

if (Meteor.isClient) {
  describe('LearningPaths.jsx', function () {
    const meteorReactProps = {
      location: {
        pathname: '/learning-paths',
        search: '',
      },
      history: {
        push() {},
      },
      user: {
        _id: Random.id(),
      },
    };

    const defaultProps = {
      loading: false,
      learningPathList: generateLearningPathDataList(meteorReactProps.user._id),
      selector: {},
      filterOpts: FILTER_OPTIONS,
      ...meteorReactProps,
      userId: meteorReactProps.user._id,
    };

    const layout = (<LearningPathsTest {...defaultProps} />);
    const meteorReactLayout = (<LearningPathsTest {...meteorReactProps} />);

    it('should render', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(layout);
      const actual = renderer.getRenderOutput();

      const expected = `className="LearningPaths"`;
      expect(actual).to.include(expected);
    });

    it('should render RenderLearningPathList if not loading', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(layout);
      const actual = renderer.getRenderOutput();

      const expected = (
        <RenderLearningPathList
          {..._.pick(defaultProps, ['learningPathList', 'user', 'userId'])}
        />
      );
      expect(actual).to.include(expected);
    });

    it('should render Loading component if loading', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <LearningPathsTest
          loading
          {..._.omit(defaultProps, ['loading'])}
        />,
      );
      const actual = renderer.getRenderOutput();

      const expected = (<Loading />);
      expect(actual).to.include(expected);
    });

    it('should disable "Load More" button if still loading', function () {
      const renderer = TestUtils.createRenderer();
      renderer.render(
        <LearningPathsTest
          loading
          {..._.omit(defaultProps, ['loading'])}
        />,
      );
      const instance = renderer._instance._instance;
      const actual = renderer.getRenderOutput();

      const expected = (
        <RaisedButton
          className="LearningPaths-load-more-btn"
          label="Load More"
          disabled
          onClick={instance.loadMoreHandler}
          style={{ margin: 30 }}
        />
      );
      expect(actual).to.include(expected);
    });

    it('should call subscribe to more LearningPaths when "Load More" button is clicked', function () {
      const subscriptionStub = sinon.stub(Meteor, 'subscribe');
      const testDoc = TestUtils.renderIntoDocument(getTestDoc(layout));
      const loadMoreBtn = TestUtils.findRenderedDOMComponentWithClass(testDoc, 'LearningPaths-load-more-btn').children[0];

      TestUtils.Simulate.click(loadMoreBtn);
      assert.equal(subscriptionStub.calledOnce, true);
      // sinon.assert.calledWith(subscriptionStub, 'learning-paths', defaultProps.selector, {
      //   sort: ['aggregatedVotes', 'desc'],
      //   limit: 60,
      // });

      subscriptionStub.restore();
    });

    // it('should receive props to render a meteor-react component with new props', function () {
    //   const subscriptionStub = sinon.stub(Meteor, 'subscribe');
    //   const findStub = sinon.stub(LearningPathCollection, 'find');
    //   subscriptionStub.returns({ ready() { return true; } });
    //   findStub.returns({ fetch() { return defaultProps.learningPathList; } });

    //   const renderer = TestUtils.createRenderer();
    //   renderer.render(meteorReactLayout);
    //   const actual = renderer.getRenderOutput().props.children[1];

    //   const expected = meteorReactProps;
    //   console.log(actual)
    //   console.log(expected)
    //   expect(actual).to.deep.equal(expected);

    //   subscriptionStub.restore();
    //   findStub.restore();
    // });

    it('should assign the selector prop with an appropriate value for non-skill queries', function () {
      const subscriptionStub = sinon.stub(Meteor, 'subscribe');
      const findStub = sinon.stub(LearningPathCollection, 'find');
      subscriptionStub.returns({ ready() { return true; } });
      findStub.returns({ fetch() { return defaultProps.learningPathList; } });

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <LearningPaths
          location={{
            ..._.pick(meteorReactProps.location, ['pathname']),
            search: '?title=hello',
          }}
          {..._.omit(meteorReactProps, ['location'])}
        />,
      );

      sinon.assert.calledWith(
        subscriptionStub,
        'learning-paths',
        { title: { $regex: new RegExp('hello', 'i') } },
        FIND_ALL_OPTS,
      );

      subscriptionStub.restore();
      findStub.restore();
    });

    it('should assign the selector prop with an appropriate value for skill queries', function () {
      const subscriptionStub = sinon.stub(Meteor, 'subscribe');
      const findStub = sinon.stub(LearningPathCollection, 'find');
      subscriptionStub.returns({ ready() { return true; } });
      findStub.returns({ fetch() { return defaultProps.learningPathList; } });

      const renderer = TestUtils.createRenderer();
      renderer.render(
        <LearningPaths
          location={{
            ..._.pick(meteorReactProps.location, ['pathname']),
            search: '?skills=hello',
          }}
          {..._.omit(meteorReactProps, ['location'])}
        />,
      );

      sinon.assert.calledWith(
        subscriptionStub,
        'learning-paths',
        { skills: { $elemMatch: { $regex: new RegExp('hello', 'i') } } },
        FIND_ALL_OPTS,
      );

      subscriptionStub.restore();
      findStub.restore();
    });
  });
}
