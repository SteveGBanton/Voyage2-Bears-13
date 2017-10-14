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
    label: "The name of this learning path",
  },

  mentor: {
    type: String,
    label: "The mentor's ID",
    regEx: SimpleSchema.RegEx.Id,
  },

  description: {
    type: String,
    label: "Description of the learning path",
  },

  skills: {
    type: Array,
    label: "Skills focused on in the path",
    min: 1,
  },
  'skills.$': {
    type: String,
    label: "Skill name",
  },

  resources: {
    type: Array,
    label: "All resources in this path",
    min: 1,
  },
  'resources.$': {
    type: resourceSchema,
    label: "Resource instance",
  },

  createdAt: {
    type: String,
    label: 'The date this document was created.',
    autoValue() {
      if (this.isInsert) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this document was last updated.',
    autoValue() {
      if (this.isInsert || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

LearningPaths.attachSchema(LearningPaths.schema);

export default LearningPaths;
