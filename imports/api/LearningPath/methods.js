import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';

import rateLimit from '../../modules/rate-limit';

import LearningPaths from './LearningPath';
import resourceSchema from './resource-schema';

const learningPathsInsert = new ValidatedMethod({
  name: 'learning-paths.insert',
  validate: new SimpleSchema({
    // mentor: { type: String } // check to see if user has mentor privileges
    title: { type: String },
    description: { type: String },
    skills: { type: Array, minCount: 1 },
    'skills.$': { type: String },
    resource: { type: Array, minCount: 1 },
    'resources.$': { type: resourceSchema },
  }).validator(),
  run(lp) {
    // Change when code for mentor privileges
    try {
      return LearningPaths.insert({ mentor: this.userId, ...lp });
    } catch (exception) {
      throw new Meteor.Error(
        'learning-paths.insert.error',
        `Error inserting new Learning Path: ${exception}`,
      );
    }
  },
});

const learningPathsUpdate = new ValidatedMethod({
  name: 'learning-paths.update',
  validate: new SimpleSchema({
    _id: { type: String, regEx: SimpleSchema.RegEx.Id },
    title: { type: String },
    description: { type: String },
    skills: { type: Array },
    'skills.$': { type: String },
    resource: { type: Array },
    'resources.$': { type: resourceSchema },
  }).validator(),
  run(lp) {
    try {
      return LearningPaths.update({ _id: lp._id }, { $set: lp });
    } catch (exception) {
      console.log("Problem with updating Learning Path:", err);
    }
  },
});

export { learningPathsInsert, learningPathsUpdate };

rateLimit({
  methods: [
    'learning-paths.insert',
    'learning-paths.update',
  ],
  limit: 5,
  timeRange: 1000,
});
