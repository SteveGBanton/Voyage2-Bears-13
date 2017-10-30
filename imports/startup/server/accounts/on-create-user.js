import { Accounts } from 'meteor/accounts-base';

Accounts.onCreateUser((options, user) => {
  const userToCreate = user;
  if (options.profile) userToCreate.profile = options.profile;

  // Saved Paths. Stored as {pathId: true}
  userToCreate.savedLearningPaths = {};

  // Votes On Paths. Stored as {pathId: 1} or {pathId: -1}. Zero is absence of a vote.
  userToCreate.votes = {};

  // Completed Resources. Stored as {pathId: {resourceId: true}}
  userToCreate.completedResources = {};

  return userToCreate;
});
