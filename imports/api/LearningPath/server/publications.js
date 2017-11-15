import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import SimpleSchema from 'simpl-schema';
import LearningPaths from '../LearningPath';

Meteor.publish('learning-paths', (query = {}, opts = { sort: ['aggregatedVotes', 'desc'], limit: 30 }) => {
  try {
    check(query, Object);
    check(opts, {
      sort: Array,
      limit: Number,
    });
    return LearningPaths.find(query, opts);
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.error',
      `Error retrieving Learning Path data. ${exception}`,
    );
  }
});

Meteor.publish('learning-paths.mentor', (query = {}, opts) => {
  try {
    check(query, Object);
    check(opts, {
      sort: Object,
      limit: Number,
    });
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
    check(lpId, String);
    return LearningPaths.find({ _id: lpId });
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
    return LearningPaths.find({
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
