/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';

let action;

const updateUser = (userId, { previousEmailAddress, emailAddress, profile }) => {
  try {
    if (emailAddress) {
      Meteor.users.update(userId, {
        $set: {
          'emails.0.address': emailAddress,
        },
      });

      if (emailAddress !== previousEmailAddress) {
        Meteor.users.update(userId, {
          $set: {
            'emails.0.verified': false,
          },
        });
      }
    }
    if (profile) {
      Meteor.users.update(userId, {
        $set: {
          profile
        },
      });
    }
  } catch (exception) {
    action.reject(`[editProfile.updateUser] ${exception}`);
  }
};

const editProfile = ({ userId, profile }, promise) => {
  try {
    action = promise;
    updateUser(userId, profile);
    action.resolve();
  } catch (exception) {
    action.reject(`[editProfile.handler] ${exception}`);
  }
};

export default options =>
  new Promise((resolve, reject) =>
    editProfile(options, { resolve, reject }));
