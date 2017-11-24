import { describe, it, beforeEach } from 'meteor/practicalmeteor:mocha';
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { expect } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';

import {
  usersToggleSaveLearningPath,
  toggleCompletedResource 
} from '../methods.js';

if (Meteor.isServer) {
  const userId = 'usertestid';
  const mockUser = { userId, user: { username: 'john-doe' } };

  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('User Methods', function () {
    let updateStub;
    let usernameStub;

    beforeEach(function () {
      updateStub = sandbox.stub(Meteor.users, 'update');
      usernameStub = sandbox.stub(Meteor, 'user');
    });

    describe('usersToggleSaveLearningPath method', function() {
      it('should update Meteor.users setting savedLearningPaths with ID and value', function() {
        usernameStub.returns({ savedLearningPaths: {} });
        const learningPathId = 'pathtestid';

        usersToggleSaveLearningPath._execute(mockUser, { learningPathId });
        
        const state = false;
        const field = `savedLearningPaths.${learningPathId}`;

        sinon.assert.calledWith(updateStub, mockUser.userId,
          {
            $set: {
              [field]: !state,
            },
          },
        );
      });

      it('should not save if not logged in', function() {
        usernameStub.returns({ savedLearningPaths: {} });
        const learningPathId = 'pathtestid';
        expect(() => {
          usersToggleSaveLearningPath._execute({ userId: undefined }, { learningPathId });
        }).to.throw();
      });
  
    });
    
    describe('toggleCompletedResource method', function () {
      it('should call Meteor.users.update setting completedResources', function () {
        usernameStub.returns({ completedResources: {} });
        const learningPathId = 'pathtestid';
        const resourceId = 'resourcetestid';
        toggleCompletedResource._execute(mockUser, { learningPathId, resourceId });

        const state = false;
        const field = `completedResources.${learningPathId}.${resourceId}`;

        sinon.assert.calledWith(updateStub, mockUser.userId,
          {
            $set: {
              [field]: !state,
            },
          },
        );
      });

      it('should not toggle if not logged in', function () {
        usernameStub.returns({ completedResources: {} });
        const learningPathId = 'pathtestid';
        const resourceId = 'resourcetestid';
        expect(() => {
          toggleCompletedResource._execute({ userId: undefined }, { learningPathId, resourceId });
        }).to.throw();
      });

    });

  });
};
