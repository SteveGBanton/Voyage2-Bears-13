/* eslint-disable consistent-return */

import SimpleSchema from 'simpl-schema';

const resourceSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Name of resource",
    min: 10,
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
    regEx: SimpleSchema.RegEx.Url,
  },

  createdAt: {
    type: String,
    required: false,
    autoValue() {
      if (!this.isSet) return (new Date()).toISOString();
    },
  },
  updatedAt: {
    type: String,
    required: false,
    autoValue() {
      if (!this.isSet || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

export default resourceSchema;
