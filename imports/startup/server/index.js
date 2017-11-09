import './accounts';
import './api';
import './fixtures';
import './email';

Meteor.users.deny({
  update() { return true; },
});
