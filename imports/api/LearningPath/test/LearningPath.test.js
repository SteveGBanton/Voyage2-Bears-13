/* eslint-env mocha */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
// Note: Arrow functions are discouraged in Mocha, which is why they were
//       disabled here. Arrow functions mess with the `this` context of Mocha.
//       Not sure if we'll use it, but it's here just to be safe.

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';

import {
  validateOmittedField,
  validateInvalidField,
  validateUnderMinStr,
  validateInvalidMentorId,
  validateEmptyArray,
  validateInvalidArrayElems,
  validateValidDate,
  validateCurrentDate,
  validateCleanedDates,
} from './helpers';

if (Meteor.isServer) {
  describe('LearningPath schema', function () {
    it('should not validate if not given a Title field', function () {
      validateOmittedField('title');
    });

    it('should not validate if not given a Mentor field', function () {
      validateOmittedField('mentor');
    });

    it('should not validate if not given a Description field', function () {
      validateOmittedField('description');
    });

    it('should not validate if not given a Skills field', function () {
      validateOmittedField('skills');
    });

    it('should not validate if not given a Resources field', function () {
      validateOmittedField('resources');
    });

    it('should not validate if not given a CreatedAt field', function () {
      validateOmittedField('createdAt');
    });

    it('should not validate if not given a UpdatedAt field', function () {
      validateOmittedField('updatedAt');
    });

    it('should not validate if given a non-String to Title', function () {
      validateInvalidField('title', String);
    });

    it('should not validate if given a non-String to Mentor', function () {
      validateInvalidField('mentor', String);
    });

    it('should not validate if given a non-String to Description', function () {
      validateInvalidField('description', String);
    });

    it('should not validate if given a non-Array to Skills', function () {
      validateInvalidField('title', Array);
    });

    it('should not validate if given a non-Array to Title', function () {
      validateInvalidField('title', Array);
    });

    it('should not validate if given a non-String to CreateAt', function () {
      validateInvalidField('createdAt', String);
    });

    it('should not validate if given a non-Array to UpdatedAt', function () {
      validateInvalidField('updatedAt', String);
    });

    it('should not validate if a string of less than 10 characters is given to title', function () {
      validateUnderMinStr('title', 10);
    });

    it('should not validate if mentor is not an ID string', function () {
      validateInvalidMentorId();
    });

    it('should not validate if Skills array is empty', function () {
      validateEmptyArray('skills');
    });

    it('should not validate if Skills array contains non-String elements', function () {
      validateInvalidArrayElems('skills', String);
    });

    it('should not validate if Resources array is empty', function () {
      validateEmptyArray('resources');
    });

    it('should not validate if Resourcs array contains non-Object elements', function () {
      validateInvalidArrayElems('resources', Object);
    });

    it('should generate a createdAt field with a Date ISOString', function () {
      validateValidDate('createdAt');
    });

    it('should generate a createdAt field that is the date at that time', function () {
      validateCurrentDate('createdAt');
    });

    it('should keep the createdAt field the same even when cleaning again', function () {
      // I'm not sure if the `assert` methods have a `this` context that is used
      // so I'm binding it just to be safe
      validateCleanedDates('createdAt', assert.equal.bind(assert));
    });

    it('should generate an updatedAt field with a Date ISOString', function () {
      validateValidDate('updatedAt');
    });

    it('should generate an updatedAt field that is the date at that time', function () {
      validateCurrentDate('updatedAt');
    });

    it('should change the updatedAt field when it is cleaned again', function () {
      // I'm not sure if the `assert` methods have a `this` context that is used
      // so I'm binding it just to be safe
      validateCleanedDates('updatedAt', assert.notEqual.bind(assert));
    });
  });
}
