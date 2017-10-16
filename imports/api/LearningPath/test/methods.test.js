/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha.
//       Not sure if we'll use it, but it's here just to be safe.

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

import LearningPaths from '../LearningPath';
import { learningPathsInsert, learningPathsUpdate, learningPathsRemove } from '../methods';

import {
  checkCalledInsert,
  checkCalledUpdate,
  checkCalledRemove,
  checkUpdateReturnId,
  checkOmittedFieldError,
  checkInvalidTypeError,
  checkInvalidIdError,
  checkBelowLenStrError,
  checkEmptySkillArrayError,
  checkEmptyResourceArrayError,
  checkInvalidArrayElemsError,
} from './helpers';

if (Meteor.isServer) {
  const sandbox = sinon.createSandbox();

  afterEach(function () {
    sandbox.restore();
  });

  describe('LearningPath methods', function () {
    describe('learningPathsInsert', function () {
      const _execute = learningPathsInsert._execute.bind(learningPathsInsert);
      let stub;

      beforeEach(function () {
        // Replaces LearningPaths.insert with a fake method
        // This will watch it and see if it gets called
        stub = sandbox.stub(LearningPaths, 'insert');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call `LearningPaths.insert`', function () {
        checkCalledInsert(sandbox, stub, _execute);
      });

      it('should throw an error if not given a Title', function () {
        checkOmittedFieldError('title', _execute);
      });

      it('should throw an error if not given a Description', function () {
        checkOmittedFieldError('description', _execute);
      });

      it('should throw an error if not given Skills', function () {
        checkOmittedFieldError('skills', _execute);
      });

      it('should throw an error if not given Resources', function () {
        checkOmittedFieldError('resources', _execute);
      });

      it('should throw an error if given a non-String to Title', function () {
        checkInvalidTypeError('title', String, _execute);
      });

      it('should throw an error if given a non-String to Description', function () {
        checkInvalidTypeError('description', String, _execute);
      });

      it('should throw an error if given a non-Array to Skills', function () {
        checkInvalidTypeError('skills', Array, _execute);
      });

      it('should throw an error if given a non-Array to Resources', function () {
        checkInvalidTypeError('resources', Array, _execute);
      });

      it('should throw an error if Title is given a string under the min length', function () {
        checkBelowLenStrError('title', 10, _execute);
      });

      it('should throw an error if no skills are given', function () {
        checkEmptySkillArrayError(_execute);
      });

      it('should throw an error if any skills are not Strings', function () {
        checkInvalidArrayElemsError('skills', String, _execute);
      });

      it('should throw an error if no resources are given', function () {
        checkEmptyResourceArrayError(_execute);
      });

      it('should throw an error if any resources are not an Object', function () {
        checkInvalidArrayElemsError('resources', Object, _execute);
      });
    });

    describe('learningPathsUpdate', function () {
      const _execute = learningPathsUpdate._execute.bind(learningPathsUpdate);
      let stub;

      beforeEach(function () {
        // Replaces LearningPaths.update with a fake method
        // This will watch it and see if it gets called
        stub = sandbox.stub(LearningPaths, 'update');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call `LearningPaths.update`', function () {
        checkCalledUpdate(sandbox, stub);
      });

      it('should return the ID Of the LearningPath', function () {
        checkUpdateReturnId();
      });

      it('should throw an error if not given an ID', function () {
        checkOmittedFieldError('_id', _execute, { includeId: true });
      });

      it('should throw an error if not given an ID in proper format', function () {
        checkInvalidIdError(_execute);
      });

      it('should throw an error if not given a Title', function () {
        checkOmittedFieldError('title', _execute, { includeId: true });
      });

      it('should throw an error if not given a Description', function () {
        checkOmittedFieldError('description', _execute, { includeId: true });
      });

      it('should throw an error if not given Skills', function () {
        checkOmittedFieldError('skills', _execute, { includeId: true });
      });

      it('should throw an error if not given Resources', function () {
        checkOmittedFieldError('resources', _execute, { includeId: true });
      });

      it('should throw an error if given a non-String to ID', function () {
        checkInvalidTypeError('_id', String, _execute, { includeId: true });
      });

      it('should throw an error if given a non-String to Title', function () {
        checkInvalidTypeError('title', String, _execute, { includeId: true });
      });

      it('should throw an error if given a non-String to Description', function () {
        checkInvalidTypeError('description', String, _execute, { includeId: true });
      });

      it('should throw an error if given a non-Array to Skills', function () {
        checkInvalidTypeError('skills', Array, _execute, { includeId: true });
      });

      it('should throw an error if given a non-Array to Resources', function () {
        checkInvalidTypeError('resources', Array, _execute, { includeId: true });
      });

      it('should throw an error if Title is given a string under the min length', function () {
        checkBelowLenStrError('title', 10, _execute, { includeId: true });
      });

      it('should throw an error if no skills are given', function () {
        checkEmptySkillArrayError(_execute, { includeId: true });
      });

      it('should throw an error if any skills are not Strings', function () {
        checkInvalidArrayElemsError('skills', String, _execute, { includeId: true });
      });

      it('should throw an error if no resources are given', function () {
        checkEmptyResourceArrayError(_execute, { includeId: true });
      });

      it('should throw an error if any resources are not an Object', function () {
        checkInvalidArrayElemsError('resources', Object, _execute, { includeId: true });
      });
    });

    describe('learningPathsRemove', function () {
      const _execute = learningPathsRemove._execute.bind(learningPathsRemove);
      let stub;

      beforeEach(function () {
        // Replaces LearningPaths.remove with a fake method
        // This will watch it and see if it gets called
        stub = sandbox.stub(LearningPaths, 'remove');
      });

      afterEach(function () {
        stub = null;
      });

      it('should call LearningPaths.remove', function () {
        checkCalledRemove(sandbox, stub);
      });

      it('should throw an error if not given an ID', function () {
        checkOmittedFieldError('_id', _execute, { isRemoveMethod: true });
      });

      it('should throw an error if given a non-String to ID', function () {
        checkInvalidTypeError('_id', String, _execute, { isRemoveMethod: true });
      });

      it('should throw an error if not given an ID in the proper format', function () {
        checkInvalidIdError(_execute, { isRemoveMethod: true });
      });
    });
  });
}
