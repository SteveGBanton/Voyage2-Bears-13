/* eslint-disable consistent-return */

import SimpleSchema from 'simpl-schema';

const resourceSchema = new SimpleSchema({
  title: {
    type: String,
    label: "Name of resource",
  },

  description: {
    type: String,
    label: "Description of resource",
  },

  url: {
    type: String,
    label: "URL to resource",
    regEx: SimpleSchema.RegEx.Url,
  },

  thumbnail: {
    type: String,
    label: "Image URL for resource",
    regEx: SimpleSchema.RegEx.Url,
  },

  createdAt: {
    type: String,
    label: 'The date this resource was created',
    required: false,
    autoValue() {
      if (!this.isSet) new Date().toISOString();
    },
  },
  updatedAt: {
    type: String,
    label: 'The date this resource was last updated',
    required: false,
    autoValue() {
      if (!this.isSet || this.isUpdate) return (new Date()).toISOString();
    },
  },
});

export default resourceSchema;
