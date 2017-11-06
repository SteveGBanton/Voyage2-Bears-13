import './accounts';
import './api';
import './fixtures';
import './email';
import './data-test.js';

Meteor.users.deny({
  update() { return true; },
});
