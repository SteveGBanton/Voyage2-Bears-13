import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import getPrivateFile from '../../../modules/server/get-private-file';
import parseMarkdown from '../../../modules/parse-markdown';

const remoteGet = new ValidatedMethod({
  name: 'utility.remoteGet',
  validate: null,
  run(getThis) {
    try {
      console.log('getting from ... ' + getThis);
      return HTTP.get(getThis);
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
