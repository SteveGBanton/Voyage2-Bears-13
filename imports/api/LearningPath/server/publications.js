import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import LearningPaths from '../LearningPath';

Meteor.publish('learning-paths', () => {
  try {
    return LearningPaths.find({});
  } catch (exception) {
    throw new Meteor.Error(
      'learning-paths.error',
      `Error retrieving Learning Path data. ${exception}`,
    );
  }
});

Meteor.publish('learning-paths.mentor', () => {
  try {
    if (!this.userId) return this.ready();
    return LearningPaths.find({ mentor: this.userId });
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
    check(lpId, String);
    check(resourceId, String);
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
