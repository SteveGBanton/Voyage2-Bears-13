import { Meteor } from 'meteor/meteor';

Meteor.publish('users.editProfile', function usersProfile() {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish(null, function publish() {
  // Publish custom fields a user should have access to on their own user obj.
  // 'null' publish name means no need to subscribe, all users have access.
  const options = {
    fields: { current: 1, savedLearningPaths: 1, completedResources: 1 },
  };
  return Meteor.users.find({ _id: this.userId }, options);
});
