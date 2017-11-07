function sortVotes(voted) {
  // The array will be ordered by the alphabetical order of the user IDs
  return voted.sort((a, b) => {
    if (a.userId < b.userId) return -1;
    else if (a.userId > b.userId) return 1;
    return 0;
  });
}

function insertVote(voted, vote) {
  return sortVotes([...voted, vote]);
}

export function findVote(voted, userId) {
  let min = 0;
  let max = voted.length - 1;
  let m;
  while (min <= max) {
    m = Math.floor((min + max) / 2);
    if (voted[m].userId < userId) min = m + 1;
    else if (voted[m].userId > userId) max = m - 1;
    else return m;
  }

  return -1;
}

function updateVote(voted, index, newVoteVal) {
  const newVoted = voted;
  newVoted[index].voteVal = newVoteVal;
  return newVoted;
}

function removeVote(voted, index) {
  return [...voted.slice(0, index), ...voted.slice(index + 1)];
}

export function castVote(aggregatedVotes, voted, voteVal) {
  let newVoted;
  let newAggregatedVotes;

  const index = findVote(voted, this.userId);
  if (index !== -1) { // The user has voted
    if (voted[index].voteVal === voteVal) { // Has voted this way
      // The user's vote is removed and the value is subtracted from aggregated votes
      newVoted = removeVote(voted, index);
      newAggregatedVotes = aggregatedVotes - voteVal;
    } else if (voted[index].voteVal === -voteVal) { // Has voted the opposite way
      // The user's vote is changed to this value and the value is doubled and
      // added to aggregated votes
      newVoted = updateVote(voted, index, voteVal);
      newAggregatedVotes = aggregatedVotes + (voteVal * 2);
    }
  } else { // The user is voting without a vote already being casted
    // The user is added to the voted users and the vote value is added to
    // the aggregate vote
    newVoted = insertVote(voted, {
      userId: this.userId,
      voteVal,
    });
    newAggregatedVotes = aggregatedVotes + voteVal;
  }

  // Return for immediate use in `LearningPaths.update`
  return { voted: newVoted, aggregatedVotes: newAggregatedVotes };
}
