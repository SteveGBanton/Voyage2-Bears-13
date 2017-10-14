import { Random } from 'meteor/random';
import { faker } from 'meteor/practicalmeteor:faker';
import { assert } from 'meteor/practicalmeteor:chai';
import _ from 'lodash';

const MAX_GENERATED = 10;

const mockUser = { userId: Random.id() };

function generateSkills() {
  return _.times(_.random(1, MAX_GENERATED), () => faker.lorem.word);
}

function generateSingleResource() {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    url: faker.internet.url(),
    thumbnail: faker.image.image(),
  };
}

function generateResources() {
  return _.times(_.random(1, MAX_GENERATED), () => generateSingleResource());
}

// type is data type of the field
function generateInvalidField(type) {
  const DATA_TYPES = [
    String,
    Number,
    Boolean,
    Array,
    Object,
  ];

  return _.sample(DATA_TYPES.filter(elem => elem !== type))();
}

function generateData(opts = { includeId: false }) {
  const data = {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    skills: generateSkills(),
    resources: generateResources(),
  };
  if (opts.includeId) data._id = Random.id();

  return data;
}

function capitalizeField(field) {
  return field !== '_id' ? _.capitalize(field) : 'ID';
}

function checkOmittedFieldError(field, method, opts) {
  const toInsert = generateData(opts);
  assert.throws(() => {
    method._execute(mockUser, { ..._.omit(toInsert, [field]) });
  }, `${capitalizeField(field)} is required`);
}

function checkInvalidTypeError(field, type, method, opts) {
  const toInsert = generateData(opts);
  toInsert[field] = generateInvalidField(type);
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${capitalizeField(field)} must be of type ${type.name}`);
}

function checkBelowLenStrError(field, len, method, opts) {
  const toInsert = generateData(opts);
  toInsert[field] = faker.lorem.sentence().slice(0, _.random(0, _.max([0, len - 1])));
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${capitalizeField(field)} must be at least ${len} characters`);
}

function checkBelowSkillArrayCountError(count, method, opts) {
  const toInsert = generateData(opts);
  toInsert.skills = _.times(_.random(0, _.max([0, count - 1])), () => faker.lorem.sentence());
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `You must specify at least ${count} values`);
}

function checkBelowResourceArrayCountError(count, method, opts) {
  const toInsert = generateData(opts);
  toInsert.skills = _.times(_.random(0, _.max([0, count - 1])), () => generateSingleResource());
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `You must specify at least ${count} values`);
}

function checkInvalidArrayElemsError(field, type, method, opts) {
  const toInsert = generateData(opts);
  toInsert[field] = _.times(_.random(1, MAX_GENERATED), () => generateInvalidField(type));
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${capitalizeField(field)} must be of type ${type.name}`);
}

export {
  mockUser,
  generateData,
  checkOmittedFieldError,
  checkInvalidTypeError,
  checkBelowLenStrError,
  checkBelowSkillArrayCountError,
  checkBelowResourceArrayCountError,
  checkInvalidArrayElemsError,
};
