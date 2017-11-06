/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import resourceSchema from './resource-schema';

const LearningPaths = new Mongo.Collection('LearningPaths');

export const MAX_SKILLS = 3;
export const MAX_RESOURCES = 10;
export const MIN_TITLE_LENGTH = 10;
export const MAX_TITLE_LENGTH = 30;

LearningPaths.allow({
  insert: () => false,
  update: () => false,
  remove: () => false,
});

LearningPaths.deny({
  insert: () => true,
  update: () => true,
  remove: () => true,
});

LearningPaths.schema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  title: {
    type: String,
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
  },
  
  mentor: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  description: {
    type: String,
  },

  thumbnail: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },

  aggregatedVotes: {
    type: Number,
  },

  voted: {
    type: Object,
  },

  skills: {
    type: Array,
    minCount: 1,
    maxCount: MAX_SKILLS,
  },
  'skills.$': {
    type: String,
  },

  resources: {
    type: Array,
    minCount: 1,
    maxCount: MAX_RESOURCES,
  },
  'resources.$': {
    type: resourceSchema.omit(['createdAt', 'updatedAt']),
  },

  createdAt: {
    type: String,
    autoValue() {
      if (!this.isSet || this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    autoValue() {
      if (!this.isSet || this.isInsert ||
        this.value || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

LearningPaths.attachSchema(LearningPaths.schema.omit('_id'));

export default LearningPaths;
