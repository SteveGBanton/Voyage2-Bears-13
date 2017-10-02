import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from './Documents';
import rateLimit from '../../modules/rate-limit';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const documentsInsert = new ValidatedMethod({
  name: 'documents.insert',
  validate: new SimpleSchema({
    title: { type: String },
    body: { type: String }
  }).validator(),
  run(doc) {
    return Documents.insert({ owner: this.userId, ...doc });
  }
})

export const documentsUpdate = new ValidatedMethod({
  name: 'documents.update',
  validate: new SimpleSchema({
    _id: { type: String },
    title: { type: String },
    body: { type: String }
  }).validator(),
  run(doc) {
      const documentId = doc._id;
      Documents.update(documentId, { $set: doc });
      return documentId; // Return _id so we can redirect to document after update.
  }
})

export const documentsRemove = new ValidatedMethod({
  name: 'documents.remove',
  validate: new SimpleSchema({
    documentId: { type: String }
  }).validator(),
  run({documentId}) {
    try {
      return Documents.remove(documentId);
    } catch (exception) {
      throw new Meteor.Error('500', exception);
    }
  }
})

rateLimit({
  methods: [
    'documents.insert',
    'documents.update',
    'documents.remove',
  ],
  limit: 5,
  timeRange: 1000,
});
