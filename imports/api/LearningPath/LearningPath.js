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

  description: {
    type: String,
    label: "Description of the learning path",
  },

  skills: {
    type: Array,
    label: "Skills focused on in the path",
  },
  'skills.$': String,

  resources: {
    type: Array,
    label: "All resources in this path",
  },
  'resources.$': {
    type: resourceSchema,
    label: "An instance of a resource",
  },

  mentors: {
    type: Array,
    label: "An array of mentor IDs",
  },
  'mentors.$': {
    type: String,
    label: "Mentor ID",
    regEx: SimpleSchema.RegEx.Id,
  },
});

LearningPaths.attachSchema(LearningPaths.schema);

export default LearningPaths;
