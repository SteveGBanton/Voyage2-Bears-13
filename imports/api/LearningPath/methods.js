import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import _ from 'lodash';

import rateLimit from '../../modules/rate-limit';

import LearningPaths from './LearningPath';

const insertSchema = LearningPaths.schema.omit('_id', 'mentor', 'createdAt', 'updatedAt');
const updateSchema = LearningPaths.schema.omit('mentor', 'createdAt', 'updatedAt');
const removeSchema = LearningPaths.schema.pick('_id');

const ERROR_MSG = 'Unauthorized access';

const learningPathsInsert = new ValidatedMethod({
  name: 'learning-paths.insert',
  validate: insertSchema.validator(),
  run(lp) {
    try {
      return LearningPaths.insert({ mentor: this.userId, ...lp });
    } catch (exception) {
      throw new Meteor.Error(
        'learning-paths.insert.error',
        `Error inserting new Learning Path. ${exception}`,
      );
    }
  },
});

const learningPathsUpdate = new ValidatedMethod({
  name: 'learning-paths.update',
  validate: updateSchema.validator(),
  run(lp) {
    try {
      const { _id } = lp;
      const { mentor } = LearningPaths.findOne({ _id });
      if (mentor !== this.userId) throw new Meteor.Error('learning-paths.update.error', ERROR_MSG);
      const lpArg = _.omit(lp, '_id');
      LearningPaths.update({ _id }, { $set: lpArg });
      return _id;
    } catch (exception) {
      throw new Meteor.Error(
        'learning-paths.update.error',
        `Error updating Learning Path. ${exception}`,
      );
    }
  },
});

const learningPathsRemove = new ValidatedMethod({
  name: 'learning-paths.remove',
  validate: removeSchema.validator(),
  run(lp) {
    try {
      const { _id } = lp;
      const { mentor } = LearningPaths.findOne({ _id });
      if (mentor !== this.userId) throw new Meteor.Error('learning-paths.remove.error', ERROR_MSG);
      return LearningPaths.remove(lp);
    } catch (exception) {
      throw new Meteor.Error(500, exception);
    }
  },
});

export { learningPathsInsert, learningPathsUpdate, learningPathsRemove };

rateLimit({
  methods: [
    'learning-paths.insert',
    'learning-paths.update',
    'learning-paths.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
