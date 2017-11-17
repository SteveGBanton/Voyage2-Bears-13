import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import rateLimit from '../../../modules/rate-limit';

import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

const remoteGet = new ValidatedMethod({
  name: 'utility.remoteGet',
  validate: null,
  run(getThis) {
    try {
      const options = {
        timeout: 6000,
        headers: {
          ACCEPT: 'text/html',
          USER_AGENT: 'Learn-Map/0.1',
        },
      };
      return HTTP.get(getThis, options);
    } catch (e) {
      throw new Meteor.Error('500', e);
    }
  },
});

export default remoteGet;

Meteor.methods({
  'utility.getPage': function utilityGetPage(fileName) {
    check(fileName, String);
    return parseMarkdown(getPrivateFile(`pages/${fileName}.md`));
  },
});

rateLimit({
  methods: [
    'utility.remoteGet',
    'utility.getPage',
  ],
  limit: 5,
  timeRange: 1000,
});
