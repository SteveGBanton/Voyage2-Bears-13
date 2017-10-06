import rateLimit from '../../modules/rate-limit';

const addSavedLearningPath = new ValidatedMethod({
  name: 'users.addSavedLearningPath',
  validate: new SimpleSchema({
    learningPathId: { type: String },
  }).validator(),
  run(learningPathId) {
    try {
      // TODO add logic to save learning path to savedLearningPaths user property.

    } catch (exception) {
      throw new Meteor.Error('users.addSavedLearningPath.error',
        `Error saving learning path. ${exception}`);
    }
  },
});

const markResourceAsCompleted = new ValidatedMethod({
  name: 'users.markResourceAsCompleted',
  validate: new SimpleSchema({
    resourceId: { type: String },
  }).validator(),
  run(resourceId) {
    try {
      // TODO add logic to mark resource as complete.

    } catch (exception) {
      throw new Meteor.Error('users.addSavedLearningPath.error',
        `Error marking resource as complete. ${exception}`);
    }
  },
});

rateLimit({
  methods: [
    'users.addSavedLearningPath',
    'users.markResourceAsCompleted',
  ],
  limit: 5,
  timeRange: 1000,
});
