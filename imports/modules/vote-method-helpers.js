export default function castVote(aggregatedVotes, voted, voteVal) {
  let newAggregatedVotes;
  let voteContext;

  // The user has voted
  if (voted[this.userId] === voteVal) { // Has voted this way
    // The user's vote is removed and the value is subtracted from aggregated votes
    voteContext = { [this.userId]: 0 };
    newAggregatedVotes = aggregatedVotes - voteVal;
  } else if (voted[this.userId] === -voteVal) { // Has voted the opposite way
    // The user's vote is changed to this value and the value is doubled and
    // added to aggregated votes
    voteContext = { [this.userId]: voteVal };
    newAggregatedVotes = aggregatedVotes + (voteVal * 2);
  } else { // The user is voting without a vote already being casted
    // The user is added to the voted users and the vote value is added to
    // the aggregate vote
    voteContext = { [this.userId]: voteVal };
    newAggregatedVotes = aggregatedVotes + voteVal;
  }

  // Return for immediate use in `LearningPaths.update`
  return { voteContext, newAggregatedVotes };
}
