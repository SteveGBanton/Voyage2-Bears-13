import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import LearningPaths from '../LearningPath';

const FIND_ALL_OPTS = {
  sort: { aggregatedVotes: 'desc' },
  skip: 0,
  limit: Infinity,
};

Meteor.publish('learning-paths', (query = {}, opts = FIND_ALL_OPTS) => {
  try {
    return LearningPaths.find(query, opts);
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.error',
      `Error retrieving Learning Path data. ${exception}`,
    );
  }
});

Meteor.publish('learning-paths.mentor', (query = {}, opts = FIND_ALL_OPTS) => {
  try {
    if (!this.userId) return this.ready();
    return LearningPaths.find({ mentor: this.userId, ...query }, opts);
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.mentor.error',
      `Error retrieving current mentor's Learning Path data. ${exception}`,
    );
  }
});

Meteor.publish('learning-paths.view', (lpId) => {
  try {
    check(lpId, SimpleSchema.RegEx.Id);
    return LearningPaths.findOne({ _id: lpId });
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.view.error',
      `Error retrieiving Learning Path document. ${exception}`,
    );
  }
});

// Return Learning Path if it has a particular resource
Meteor.publish('learning-paths.resource', (lpId, resourceId) => {
  try {
    check(lpId, SimpleSchema.RegEx.Id);
    check(resourceId, SimpleSchema.RegEx.Id);
    return LearningPaths.findOne({
      _id: lpId,
      resources: {
        $elemMatch: { $eq: resourceId },
      },
    });
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.resource',
      `Error retrieving Learning Path with resource ID ${resourceId}. ${exception}`,
    );
  }
});
