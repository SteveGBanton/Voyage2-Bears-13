/* eslint-disable consistent-return */

import SimpleSchema from 'simpl-schema';

import { MIN_TITLE_LENGTH, MAX_TITLE_LENGTH } from './LearningPath';

const resourceSchema = new SimpleSchema({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },

  title: {
    type: String,
    min: MIN_TITLE_LENGTH,
    max: MAX_TITLE_LENGTH,
  },

  description: {
    type: String,
  },

  url: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
  },

  thumbnail: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
  },

  createdAt: {
    type: String,
    optional: true,
    autoValue() {
      if (!this.isSet) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    optional: true,
    autoValue() {
      if (!this.isSet || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

export default resourceSchema;
