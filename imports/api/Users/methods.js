import rateLimit from '../../modules/rate-limit';
import SimpleSchema from 'simpl-schema';

// Deny all client-side updates to user documents
// Security issue in meteor
// https://guide.meteor.com/accounts.html#dont-use-profile
Meteor.users.deny({
  update() { return true; },
});

const usersToggleSaveLearningPath = new ValidatedMethod({
  name: 'users.toggleSaveLearningPath',
  validate: new SimpleSchema({
    learningPathId: { type: String },
  }).validator(),
  run({ learningPathId }) {
    try {
      if (!this.userId) {
        throw new Meteor.Error('usersToggleSaveLearningPath', 'Sorry, you must be logged in to save learning paths.');
      }
      const state = !!Meteor.user().savedLearningPaths[learningPathId];
      const field = `savedLearningPaths.${learningPathId}`;
      Meteor.users.update(this.userId,
        {
          $set: {
            [field]: !state,
          },
        },
      );
    } catch (exception) {
      throw new Meteor.Error('users.toggleSaveLearningPath.error',
        `Error saving learning path. ${exception}`);
    }
  },
});

const toggleCompletedResource = new ValidatedMethod({
  name: 'users.toggleCompletedResource',
  validate: new SimpleSchema({
    resourceId: { type: String },
    learningPathId: { type: String },
  }).validator(),
  run({ learningPathId, resourceId }) {
    try {
      if (!this.userId) {
        throw new Meteor.Error('userstoggleCompletedResource', 'Sorry, you must be logged in to complete resources.');
      }
      const state = (Meteor.user().completedResources[learningPathId]) ? !!Meteor.user().completedResources[learningPathId][resourceId] : false;
      const field = `completedResources.${learningPathId}.${resourceId}`;
      Meteor.users.update(this.userId,
        {
          $set: {
            [field]: !state,
          },
        },
      );
    } catch (exception) {
      throw new Meteor.Error('users.toggleCompletedResource.error',
        `Error marking resource as complete. ${exception}`);
    }
  },
});

export { toggleCompletedResource, usersToggleSaveLearningPath }

rateLimit({
  methods: [
    'users.toggleSaveLearningPath',
    'users.toggleCompletedResource',
  ],
  limit: 5,
  timeRange: 1000,
});
