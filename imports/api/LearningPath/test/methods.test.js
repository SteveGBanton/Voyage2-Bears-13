/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha.
//       Not sure if we'll use it, but it's here just to be safe.

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

import LearningPaths from '../LearningPath';
import {
  learningPathsInsert,
  learningPathsUpdate,
  learningPathsRemove,
  learningPathsUpvote,
  learningPathsDownvote,
} from '../methods';

function getMockMentor(mockUser) {
  let mockMentor;
  do {
    mockMentor = Random.id();
  } while (mockMentor === mockUser.userId);

  return mockMentor;
}

if (Meteor.isServer) {
  const userId = Random.id();
  const mockUser = { userId };
  const mockMentor = getMockMentor(mockUser);
  const mockData = {
    title: 'Learning Path Title',
    description: 'Learning Path description',
    thumbnail: 'https://fakeurl.com/thumbnail.jpg',
    skills: ['JS', 'HTML', 'CSS'],
    resources: [
      {
        _id: Random.id(),
        title: 'Resource Title1',
        description: 'Resource description1',
        url: 'https://fakeurl1.com',
        thumbnail: 'https://fakeurl1.com/thumbnail.jpg',
      },
      {
        _id: Random.id(),
        title: 'Resource Title2',
        description: 'Resource description2',
        url: 'https://fakeurl2.com',
        thumbnail: 'https://fakeurl2.com/thumbnail.jpg',
      },
    ],
  };

  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('learningPathsInsert', function () {
    let insertStub;

    beforeEach(function () {
      insertStub = sandbox.stub(LearningPaths, 'insert');
    });

    it('should call LearningPaths.insert', function () {
      learningPathsInsert._execute(mockUser, mockData);
      sinon.assert.calledWith(insertStub, {
        mentor: mockUser.userId,
        aggregatedVotes: 0,
        voted: [],
        ...mockData,
      });
    });
  });

  describe('learningPathsUpdate', function () {
    let findStub;
    let updateStub;

    beforeEach(function () {
      findStub = sandbox.stub(LearningPaths, 'findOne');
      updateStub = sandbox.stub(LearningPaths, 'update');
    });

    it('should call LearningPaths.update', function () {
      const lpId = { _id: Random.id() };

      findStub.withArgs(lpId).returns({ mentor: mockUser.userId });

      learningPathsUpdate._execute(mockUser, { ...lpId, ...mockData });
      sinon.assert.calledWith(updateStub, lpId, { $set: mockData });
    });

    it('should not update if user is not mentor', function () {
      const lpId = { _id: Random.id() };

      findStub.withArgs(lpId).returns({ mentor: mockMentor });

      assert.throws(() => {
        learningPathsUpdate._execute(mockUser, { ...lpId, ...mockData });
      }, /Unauthorized access/);
    });
  });

  describe('learningPathsRemove', function () {
    let findStub;
    let removeStub;

    beforeEach(function () {
      findStub = sandbox.stub(LearningPaths, 'findOne');
      removeStub = sandbox.stub(LearningPaths, 'remove');
    });

    it('should call LearningPaths.remove', function () {
      const lpId = { _id: Random.id() };

      findStub.withArgs(lpId).returns({ mentor: mockUser.userId });

      learningPathsRemove._execute(mockUser, lpId);
      sinon.assert.calledWith(removeStub, lpId);
    });

    it('should not remove if user is not mentor', function () {
      const lpId = { _id: Random.id() };

      findStub.withArgs(lpId).returns({ mentor: mockMentor });

      assert.throws(() => {
        learningPathsRemove._execute(mockUser, lpId);
      }, 'Unauthorized access');
    });
  });

  describe('learningPathsUpvote', function () {
    let findStub;
    let updateStub;

    beforeEach(function () {
      findStub = sandbox.stub(LearningPaths, 'findOne');
      updateStub = sandbox.stub(LearningPaths, 'update');
    });

    it('should increase the aggregatedVotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({ mentor: mockMentor, voted: [], aggregatedVotes: 0 });

      const expected = { voted: [{ userId: mockUser.userId, voteVal: 1 }], aggregatedVotes: 1 };

      learningPathsUpvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should remove the vote if user unvotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: [{ userId: mockUser.userId, voteVal: 1 }],
        aggregatedVotes: 1,
      });

      const expected = { voted: [], aggregatedVotes: 0 };

      learningPathsUpvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should remove user downvote and increase the aggregatedVotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: [{ userId: mockUser.userId, voteVal: -1 }],
        aggregatedVotes: -1,
      });

      const expected = { voted: [{ userId: mockUser.userId, voteVal: 1 }], aggregatedVotes: 1 };

      learningPathsUpvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should throw an error if a user is not logged on when voting', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: {},
        aggregatedVotes: 0,
      });

      assert.throws(() => {
        learningPathsUpvote._execute({ user: null }, lpId);
      }, 'You must be logged in to vote');
    });

    it('should throw an error if a mentor votes on their own path', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: {},
        aggregatedVotes: 0,
      });

      assert.throws(() => {
        learningPathsUpvote._execute({ user: { _id: mockMentor }, userId: mockMentor }, lpId);
      }, 'Cannot vote own created Learning Path');
    });
  });

  describe('learningPathsDownvote', function () {
    let findStub;
    let updateStub;

    beforeEach(function () {
      findStub = sandbox.stub(LearningPaths, 'findOne');
      updateStub = sandbox.stub(LearningPaths, 'update');
    });

    it('should decrease the aggregatedVotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({ mentor: mockMentor, voted: [], aggregatedVotes: 0 });

      const expected = { voted: [{ userId: mockUser.userId, voteVal: -1 }], aggregatedVotes: -1 };

      learningPathsDownvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should remove the vote if user unvotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: [{ userId: mockUser.userId, voteVal: -1 }],
        aggregatedVotes: -1,
      });

      const expected = { voted: [], aggregatedVotes: 0 };

      learningPathsDownvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should remove user upvote and decrease the aggregatedVotes', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: [{ userId: mockUser.userId, voteVal: 1 }],
        aggregatedVotes: 1,
      });

      const expected = { voted: [{ userId: mockUser.userId, voteVal: -1 }], aggregatedVotes: -1 };

      learningPathsDownvote._execute(mockUser, lpId);
      sinon.assert.calledWith(updateStub, lpId, { $set: expected });
    });

    it('should throw an error if a user is not logged on when voting', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: {},
        aggregatedVotes: 0,
      });

      assert.throws(() => {
        learningPathsDownvote._execute({ user: null }, lpId);
      }, 'You must be logged in to vote');
    });

    it('should throw an error if a mentor votes on their own path', function () {
      const lpId = { _id: Random.id() };
      findStub.withArgs(lpId).returns({
        mentor: mockMentor,
        voted: {},
        aggregatedVotes: 0,
      });

      assert.throws(() => {
        learningPathsDownvote._execute({ user: { _id: mockMentor }, userId: mockMentor }, lpId);
      }, 'Cannot vote own created Learning Path');
    });
  });
}
