import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import _ from 'lodash';

import rateLimit from '../../modules/rate-limit';

import LearningPaths from './LearningPath';

const insertSchema = LearningPaths.schema.omit('_id', 'mentor', 'aggregatedVotes', 'voted', 'createdAt', 'updatedAt');
const updateSchema = LearningPaths.schema.omit('mentor', 'aggregatedVotes', 'voted', 'createdAt', 'updatedAt');
const removeSchema = LearningPaths.schema.pick('_id');
const voteSchema = LearningPaths.schema.pick('_id');

const UNAUTH_ERROR_MSG = 'Unauthorized access';
const NOT_LOGGED_IN_ERROR = 'You must be logged in to vote';
const MENTOR_VOTE_ERROR_MSG = 'Cannot vote own created Learning Path';

const UPVOTE_VALUE = 1;
const DOWNVOTE_VALUE = -UPVOTE_VALUE;

const learningPathsInsert = new ValidatedMethod({
  name: 'learning-paths.insert',
  validate: insertSchema.validator(),
  run(lp) {
    try {
      return LearningPaths.insert({ mentor: this.userId, aggregatedVotes: 0, voted: {}, ...lp });
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

// Helper used in voting methods
function castVote(aggregatedVotes, voted, voteVal) {
  let newVoted;
  let newAggregatedVotes;

  if (_.has(voted, this.userId)) { // The user has voted
    if (voted[this.userId] === voteVal) { // Has voted this way
      // The user's vote is removed and the value is subtracted from aggregated votes
      newVoted = _.omit(voted, this.userId);
      newAggregatedVotes = aggregatedVotes - voteVal;
    } else if (voted[this.userId] === -voteVal) { // Has voted the opposite way
      // The user's vote is changed to this value and the value is doubled and
      // added to aggregated votes
      newVoted = voted;
      newVoted[this.userId] = voteVal;
      newAggregatedVotes = aggregatedVotes + (voteVal * 2);
    }
  } else { // The user is voting without a vote already being casted
    // The user is added to the voted users and the vote value is added to
    // the aggregate vote
    newVoted = voted;
    newVoted[this.userId] = voteVal;
    newAggregatedVotes = aggregatedVotes + voteVal;
  }

  // Return for immediate use in `LearningPaths.update`
  return { voted: newVoted, aggregatedVotes: newAggregatedVotes };
}

const learningPathsUpvote = new ValidatedMethod({
  name: 'learning-paths.upvote',
  validate: voteSchema.validator(),
  run(lp) {
    try {
      const { _id } = lp;
      const { mentor, voted, aggregatedVotes } = LearningPaths.findOne({ _id });
      // Mentors cannot rate own LearningPath
      if (!this.user) throw new Meteor.Error('learning-paths.upvote.error', NOT_LOGGED_IN_ERROR);
      if (mentor === this.userId) throw new Meteor.Error('learning-paths.upvote.error', MENTOR_VOTE_ERROR_MSG);

      const voteData = castVote.call(this, aggregatedVotes, voted, UPVOTE_VALUE);

      LearningPaths.update({ _id }, { $set: { ...voteData } });
    } catch (exception) {
      throw new Meteor.Error(
        'learning-paths.upvote.error',
        `Error upvoting Learning Path. ${exception}`,
      );
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
      // Mentors cannot rate own LearningPath
      if (!this.user) throw new Meteor.Error('learning-paths.upvote.error', NOT_LOGGED_IN_ERROR);
      if (mentor === this.userId) throw new Meteor.Error('learning-paths.upvote.error', MENTOR_VOTE_ERROR_MSG);

      const voteData = castVote.call(this, aggregatedVotes, voted, DOWNVOTE_VALUE);

      LearningPaths.update({ _id }, { $set: { ...voteData } });
    } catch (exception) {
      throw new Meteor.Error(
        'learning-paths.upvote.error',
        `Error upvoting Learning Path. ${exception}`,
      );
    }
  },
});

export {
  learningPathsInsert,
  learningPathsUpdate,
  learningPathsRemove,
  learningPathsUpvote,
  learningPathsDownvote,
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
