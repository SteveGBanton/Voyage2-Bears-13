/* eslint-disable consistent-return */

import { Random } from 'meteor/random';
import SimpleSchema from 'simpl-schema';

const resourceSchema = new SimpleSchema({
  _id: {
    type: String,
    label: "ID of resource",
    autoValue() {
      if (!this.isSet) return Random.id();
    },
  },

  title: {
    type: String,
    label: "Name of resource",
  },

  description: {
    type: String,
    label: "Description of resource",
    min: 200,
  },

  url: {
    type: String,
    label: "URL to resource",
    regEx: SimpleSchema.RegEx.Domain,
  },

  thumbnail: {
    type: String,
    label: "Image URL for resource",
    regEx: SimpleSchema.RegEx.Domain,
  },
});

export default resourceSchema;
