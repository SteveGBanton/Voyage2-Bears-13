import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import SimpleSchema from 'simpl-schema';
import editProfile from './edit-profile';
import rateLimit from '../../../modules/rate-limit';

const createNewUser = new ValidatedMethod({
  name: 'users.createNewUser',
  validate: new SimpleSchema({
    email: { type: String },
    password: { type: String },
    username: { type: String },
    profile: { type: Object, optional: true },
    "profile.name": { type: Object, optional: true },
    "profile.name.first": { type: String, optional: true },
    "profile.name.last": { type: String, optional: true },
  }).validator(),
  run(newAdmin) {
    try {
      const id = Accounts.createUser(newAdmin);
      return id;
    } catch (exception) {
      throw new Meteor.Error('accounts.createuser.error',
        `Error creating new user. ${exception}`);
    }
  },
});

const usersSendVerificationEmail = new ValidatedMethod({
  name: 'users.sendVerificationEmail',
  validate: null,
  run() {
    return Accounts.sendVerificationEmail(this.userId);
  },
});

const usersEditProfile = new ValidatedMethod({
  name: 'users.editProfile',
  validate: new SimpleSchema({
    previousEmailAddress: { type: String, optional: true },
    emailAddress: { type: String, optional: true },
    profile: { type: Object, optional: true },
    "profile.name": { type: Object, optional: true },
    "profile.name.first": { type: String, optional: true },
    "profile.name.last": { type: String, optional: true },
  }).validator(),
  run(profile) {
    return editProfile({ userId: this.userId, profile })
      .then(response => response)
      .catch((exception) => {
        throw new Meteor.Error('500', exception);
      });
  },
});

const usersAddUsername = new ValidatedMethod({
  name: 'users.addUsername',
  validate: new SimpleSchema({
    username: { type: String },
  }).validator(),
  run({ username }) {
    try {
      Meteor.users.update(this.userId, {
        $set: {
          username,
        },
      });
      return username;
    } catch (exception) {
      throw new Meteor.Error('users.addUsername', `Error adding username. ${exception}`);
    }
  },
});

const usersCheckUsername = new ValidatedMethod({
  name: 'users.checkUsername',
  validate: new SimpleSchema({
    potentialUserName: { type: String },
  }).validator(),
  run({ potentialUserName }) {
    return Meteor.users.find({ username: potentialUserName }).count();
  },
});

export {
  createNewUser,
  usersSendVerificationEmail,
  usersEditProfile,
  usersCheckUsername,
  usersAddUsername,
};

rateLimit({
  methods: [
    'users.editProfile',
    'users.createNewAdminUser',
    'users.checkUsername',
    'users.addUsername',
  ],
  limit: 5,
  timeRange: 1000,
});

rateLimit({
  methods: [
    'users.sendVerificationEmail',
  ],
  limit: 1,
  timeRange: 5000,
});
