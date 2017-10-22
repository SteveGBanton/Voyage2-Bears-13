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
import { learningPathsInsert, learningPathsUpdate, learningPathsRemove } from '../methods';

if (Meteor.isServer) {
  const mockUser = { userId: Random.id() };
  const mockData = {
    title: 'Learning Path Title',
    description: 'Learning Path description',
    skills: ['JS', 'HTML', 'CSS'],
    resources: [
      {
        title: 'Resource Title1',
        description: 'Resource description1',
        url: 'https://fakeurl1.com',
        thumbnail: 'https://fakeurl1.com/thumbnail.jpg',
      },
      {
        title: 'Resource Title2',
        description: 'Resource description2',
        url: 'https://fakeurl2.com',
        thumbnail: 'https://fakeurl2.com/thumbnail.jpg',
      },
    ],
  };

  describe('learningPathsInsert', function () {
    it('should call LearningPaths.insert', function () {
      const stub = sinon.stub(LearningPaths, 'insert');
      learningPathsInsert._execute(mockUser, mockData);
      sinon.assert.calledWith(stub, { mentor: mockUser.userId, ...mockData });
      stub.restore();
    });
  });

  describe('learningPathsUpdate', function () {
    it('should call LearningPaths.update', function () {
      const lpId = { _id: Random.id() };
      const findStub = sinon.stub(LearningPaths, 'findOne');
      findStub.withArgs(lpId).returns({ mentor: mockUser.userId });
      const updateStub = sinon.stub(LearningPaths, 'update');

      learningPathsUpdate._execute(mockUser, { ...lpId, ...mockData });
      sinon.assert.calledWith(updateStub, lpId, { $set: mockData });

      updateStub.restore();
      findStub.restore();
    });

    it('should not update if user is not mentor', function () {
      const lpId = { _id: Random.id() };
      const stub = sinon.stub(LearningPaths, 'findOne');
      let fakeMentor;
      do {
        fakeMentor = Random.id();
      } while (fakeMentor === mockUser.userId);
      stub.withArgs(lpId).returns({ mentor: fakeMentor });

      assert.throws(() => {
        learningPathsUpdate._execute(mockUser, { ...lpId, ...mockData });
      }, /Unauthorized access/);

      stub.restore();
    });
  });

  describe('learningPathsRemove', function () {
    it('should call LearningPaths.remove', function () {
      const lpId = { _id: Random.id() };
      const findStub = sinon.stub(LearningPaths, 'findOne');
      findStub.withArgs(lpId).returns({ mentor: mockUser.userId });
      const removeStub = sinon.stub(LearningPaths, 'remove');

      learningPathsRemove._execute(mockUser, lpId);
      sinon.assert.calledWith(removeStub, lpId);

      removeStub.restore();
      findStub.restore();
    });

    it('should not remove if user is not mentor', function () {
      const lpId = { _id: Random.id() };
      const stub = sinon.stub(LearningPaths, 'findOne');
      let fakeMentor;
      do {
        fakeMentor = Random.id();
      } while (fakeMentor === mockUser.userId);
      stub.withArgs(lpId).returns({ mentor: fakeMentor });

      assert.throws(() => {
        learningPathsRemove._execute(mockUser, lpId);
      }, /Unauthorized access/);
    });
  });
}
