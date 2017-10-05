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
    resources: { type: Array, minCount: 1 },
    'resources.$': { type: resourceSchema },
  }).validator(),
  run(lp) {
    // Change when code for mentor privileges
    return LearningPaths.insert({ mentor: this.userId, ...lp });
  },
});

export { learningPathsInsert };

rateLimit({
  methods: [
    'learning-paths.insert',
  ],
  limit: 5,
  timeRange: 1000,
});
