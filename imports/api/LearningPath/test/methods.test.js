/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { assert } from 'meteor/practicalmeteor:chai';
import { faker } from 'meteor/practicalmeteor:faker';
import sinon from 'sinon';
import _ from 'lodash';

import LearningPaths from '../LearningPath';
import { learningPathsInsert, learningPathsUpdate, learningPathsRemove } from '../methods';

import {
  mockUser,
  generateData,
  checkOmittedFieldError,
  checkInvalidTypeError,
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
    });
  });
}
