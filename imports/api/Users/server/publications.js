import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

Meteor.publish('users.editProfile', function () {
  return Meteor.users.find(this.userId, {
    fields: {
      emails: 1,
      profile: 1,
      services: 1,
    },
  });
});

Meteor.publish(null, function () {
  // Publish users own User object.
  // Some custom fields are accessible on user obj.
  // 'null' publish name means no need to subscribe, all users have access.
  const options = {
    fields: {
      savedLearningPaths: 1,
      completedResources: 1,
      votes: 1,
      'services.facebook.email': 1,
      profile: 1,
    },
  };
  return Meteor.users.find({ _id: this.userId }, options);
});


Meteor.publish('users.getSingle', function (username) {
  check(username, String);

  const options = {
    fields: {
      savedLearningPaths: 1,
      completedResources: 1,
      votes: 1,
      username: 1,
      profile: 1
    },
  };

  // Publish a single user - make sure only allowed fields are sent.
  return Meteor.users.find({ username }, options);
});
