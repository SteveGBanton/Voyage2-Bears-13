/* eslint-disable consistent-return */

import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

import resourceSchema from './resource-schema';

const LearningPaths = new Mongo.Collection('LearningPaths');

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
  title: {
    type: String,
    min: 10,
  },

  mentor: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  description: {
    type: String,
  },

  skills: {
    type: Array,
    minCount: 1,
  },
  'skills.$': {
    type: String,
    label: "Skill name",
  },

  resources: {
    type: Array,
    label: "All resources in this path",
    minCount: 1,
  },
  'resources.$': {
    type: resourceSchema,
    label: "Resource instance",
  },

  createdAt: {
    type: String,
    label: 'The date this document was created.',
    autoValue() {
      if (!this.isSet || this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (!this.isSet || this.isInsert ||
        this.value || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

LearningPaths.attachSchema(LearningPaths.schema);

export default LearningPaths;
