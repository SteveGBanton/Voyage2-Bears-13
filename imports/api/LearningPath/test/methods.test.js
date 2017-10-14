/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';
import _ from 'lodash';

import LearningPaths from '../LearningPath';
import { learningPathsInsert, learningPathsUpdate, learningPathsRemove } from '../methods';

import {
  mockUser,
  generateInvalidField,
  generateData,
  checkOmittedFieldError,
  checkInvalidTypeError,
  checkInvalidIdError,
  checkBelowLenStrError,
  checkBelowSkillArrayCountError,
  checkBelowResourceArrayCountError,
  checkInvalidArrayElemsError,
} from './helpers';

if (Meteor.isServer) {
  const sandbox = sinon.createSandbox();

  afterEach(function () {
    sandbox.restore();
  });

  describe('LearningPath methods', function () {
    describe('learningPathsInsert', function () {
      let stub;
      beforeEach(function () {
        stub = sandbox.stub(LearningPaths, 'insert');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call `LearningPaths.insert`', function () {
        const toInsert = generateData();
        const expectedObj = { mentor: mockUser.userId, ...toInsert };
        learningPathsInsert._execute(mockUser, toInsert);
        sandbox.assert.calledWith(stub, expectedObj);
      });

      it('should throw an error if not given a Title', function () {
        checkOmittedFieldError('title', learningPathsInsert);
      });

      it('should throw an error if not given a Description', function () {
        checkOmittedFieldError('description', learningPathsInsert);
      });

      it('should throw an error if not given Skills', function () {
        checkOmittedFieldError('skills', learningPathsInsert);
      });

      it('should throw an error if not given Resources', function () {
        checkOmittedFieldError('resources', learningPathsInsert);
      });

      it('should throw an error if given a non-String to Title', function () {
        checkInvalidTypeError('title', String, learningPathsInsert);
      });

      it('should throw an error if given a non-String to Description', function () {
        checkInvalidTypeError('description', String, learningPathsInsert);
      });

      it('should throw an error if given a non-Array to Skills', function () {
        checkInvalidTypeError('skills', Array, learningPathsInsert);
      });

      it('should throw an error if given a non-Array to Resources', function () {
        checkInvalidTypeError('resources', Array, learningPathsInsert);
      });

      it('should throw an error if Title is given a string under the min length', function () {
        checkBelowLenStrError('title', 10, learningPathsInsert);
      });

      it('should throw an error if no skills are given', function () {
        checkBelowSkillArrayCountError(1, learningPathsInsert);
      });

      it('should throw an error if any skills are not Strings', function () {
        checkInvalidArrayElemsError('skills', String, learningPathsInsert);
      });

      it('should throw an error if no resources are given', function () {
        checkBelowResourceArrayCountError(1, learningPathsInsert);
      });

      it('should throw an error if any resources are not an Object', function () {
        checkInvalidArrayElemsError('resources', Object, learningPathsInsert);
      });
    });

    describe('learningPathsUpdate', function () {
      let stub;
      beforeEach(function () {
        stub = sandbox.stub(LearningPaths, 'update');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call `LearningPaths.update`', function () {
        const toUpdate = generateData({ includeId: true });
        const expectedId = { _id: toUpdate._id };
        const expectedObj = { $set: _.omit(toUpdate, ['_id']) };
        learningPathsUpdate._execute(mockUser, toUpdate);
        sandbox.assert.calledWith(stub, expectedId, expectedObj);
      });

      it('should throw an error if not given an ID', function () {
        checkOmittedFieldError('_id', learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if not given an ID in proper format', function () {
        checkInvalidIdError(learningPathsUpdate);
      });

      it('should throw an error if not given a Title', function () {
        checkOmittedFieldError('title', learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if not given a Description', function () {
        checkOmittedFieldError('description', learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if not given Skills', function () {
        checkOmittedFieldError('skills', learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if not given Resources', function () {
        checkOmittedFieldError('resources', learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if given a non-String to ID', function () {
        checkInvalidTypeError('_id', String, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if given a non-String to Title', function () {
        checkInvalidTypeError('title', String, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if given a non-String to Description', function () {
        checkInvalidTypeError('description', String, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if given a non-Array to Skills', function () {
        checkInvalidTypeError('skills', Array, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if given a non-Array to Resources', function () {
        checkInvalidTypeError('resources', Array, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if Title is given a string under the min length', function () {
        checkBelowLenStrError('title', 10, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if no skills are given', function () {
        checkBelowSkillArrayCountError(1, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if any skills are not Strings', function () {
        checkInvalidArrayElemsError('skills', String, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if no resources are given', function () {
        checkBelowResourceArrayCountError(1, learningPathsUpdate, { includeId: true });
      });

      it('should throw an error if any resources are not an Object', function () {
        checkInvalidArrayElemsError('resources', Object, learningPathsUpdate, { includeId: true });
      });
    });

    describe('learningPathsRemove', function () {
      let stub;
      beforeEach(function () {
        stub = sandbox.stub(LearningPaths, 'remove');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call LearningPaths.remove', function () {
        const toRemove = { _id: Random.id() };
        learningPathsRemove._execute(mockUser, toRemove);
        sandbox.assert.calledWith(stub, toRemove);
      });

      it('should throw an error if not given an ID', function () {
        assert.throws(() => {
          learningPathsRemove._execute(mockUser, {});
        }, 'ID is required');
      });

      it('should throw an error if given a non-String to ID', function () {
        assert.throws(() => {
          learningPathsRemove._execute(mockUser, { _id: generateInvalidField(String) });
        }, 'ID must be of type String');
      });

      it('should throw an error if not given an ID in the proper format', function () {
        assert.throws(() => {
          learningPathsRemove._execute(mockUser, { _id: 'hello world' });
        }, 'ID must be a valid alphanumeric ID');
      });
    });
  });
}
