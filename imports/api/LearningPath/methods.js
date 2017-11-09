import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';

import rateLimit from '../../modules/rate-limit';

import LearningPaths from './LearningPath';

import { castVote, findVote } from './vote-method-helpers';

const insertSchema = LearningPaths.schema.omit('_id', 'mentor', 'mentorName', 'aggregatedVotes', 'voted', 'createdAt', 'updatedAt');
const updateSchema = LearningPaths.schema.omit('mentor', 'mentorName', 'aggregatedVotes', 'voted', 'createdAt', 'updatedAt');
const removeSchema = LearningPaths.schema.pick('_id');
const voteSchema = LearningPaths.schema.pick('_id');

const UNAUTH_ERROR_MSG = 'Unauthorized access';
const NOT_LOGGED_IN_ERROR = 'You must be logged in to vote.';
const MENTOR_VOTE_ERROR_MSG = 'Cannot vote own created Learning Path.';

const UPVOTE_VALUE = 1;
const DOWNVOTE_VALUE = -UPVOTE_VALUE;

const learningPathsInsert = new ValidatedMethod({
  name: 'learning-paths.insert',
  validate: insertSchema.validator(),
  run(lp) {
    try {
      return LearningPaths.insert({
        mentor: this.userId,
        mentorName: Meteor.user().username,
        aggregatedVotes: 0,
        voted: [],
        ...lp,
      });
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
      if (mentor !== this.userId) throw new Meteor.Error('learning-paths.update.error', UNAUTH_ERROR_MSG);
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
      if (mentor !== this.userId) throw new Meteor.Error('learning-paths.remove.error', UNAUTH_ERROR_MSG);
      return LearningPaths.remove(lp);
    } catch (exception) {
      throw new Meteor.Error(500, exception);
    }
  },
});

const learningPathsUpvote = new ValidatedMethod({
  name: 'learning-paths.upvote',
  validate: voteSchema.validator(),
  run(lp) {
    try {
      const { _id } = lp;
      const { mentor, voted, aggregatedVotes } = LearningPaths.findOne({ _id });

      if (!this.userId) throw new Meteor.Error('learning-paths.upvote.error', NOT_LOGGED_IN_ERROR);
      // Mentors cannot rate own LearningPath
      if (mentor === this.userId) throw new Meteor.Error('learning-paths.upvote.error', MENTOR_VOTE_ERROR_MSG);

      const voteData = castVote.call(this, aggregatedVotes, voted, UPVOTE_VALUE);

      LearningPaths.update({ _id }, { $set: voteData });
    } catch (exception) {
      throw exception;
    }
  },
});

const learningPathsDownvote = new ValidatedMethod({
  name: 'learning-paths.downvote',
  validate: voteSchema.validator(),
  run(lp) {
    try {
      const { _id } = lp;
      const { mentor, voted, aggregatedVotes } = LearningPaths.findOne({ _id });

      if (!this.userId) throw new Meteor.Error('learning-paths.upvote.error', NOT_LOGGED_IN_ERROR);
      // Mentors cannot rate own LearningPath
      if (mentor === this.userId) throw new Meteor.Error('learning-paths.upvote.error', MENTOR_VOTE_ERROR_MSG);

      const voteData = castVote.call(this, aggregatedVotes, voted, DOWNVOTE_VALUE);

      LearningPaths.update({ _id }, { $set: { ...voteData } });
    } catch (exception) {
      throw exception;
    }
  },
});

const learningPathsGetVote = new ValidatedMethod({
  name: 'learning-paths.get-vote',
  validate: voteSchema.validator(),
  run(lp) {
    try {
      if (!this.userId) return 0;
      const { _id } = lp;
      const { voted } = LearningPaths.findOne({ _id });
      const index = findVote(voted, this.userId);

      if (index !== -1) return voted[index].voteVal;
      return 0;
    } catch (exception) {
      throw exception;
    }
  },
});

export {
  learningPathsInsert,
  learningPathsUpdate,
  learningPathsRemove,
  learningPathsUpvote,
  learningPathsDownvote,
  learningPathsGetVote,
};

rateLimit({
  methods: [
    'learning-paths.insert',
    'learning-paths.update',
    'learning-paths.remove',
    'learning-paths.upvote',
    'learning-paths.downvote',
  ],
  limit: 5,
  timeRange: 1000,
});
