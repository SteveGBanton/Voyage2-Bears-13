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

function generateData() {
  return {
    title: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    skills: generateSkills(),
    resources: generateResources(),
  };
}

function checkOmittedFieldError(field, method) {
  const toInsert = generateData();
  assert.throws(() => {
    method._execute(mockUser, { ..._.omit(toInsert, [field]) });
  }, `${_.capitalize(field)} is required`);
}

function checkInvalidTypeError(field, type, method) {
  const toInsert = generateData();
  toInsert[field] = generateInvalidField(type);
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${_.capitalize(field)} must be of type ${type.name}`);
}

function checkBelowLenStrError(field, len, method) {
  const toInsert = generateData();
  toInsert[field] = faker.lorem.sentence().slice(0, _.random(0, _.max([0, len - 1])));
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${_.capitalize(field)} must be at least ${len} characters`);
}

function checkBelowSkillArrayCountError(count, method) {
  const toInsert = generateData();
  toInsert.skills = _.times(_.random(0, _.max([0, count - 1])), () => faker.lorem.sentence());
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `You must specify at least ${count} values`);
}

function checkBelowResourceArrayCountError(count, method) {
  const toInsert = generateData();
  toInsert.skills = _.times(_.random(0, _.max([0, count - 1])), () => generateSingleResource());
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `You must specify at least ${count} values`);
}

function checkInvalidArrayElemsError(field, type, method) {
  const toInsert = generateData();
  toInsert[field] = _.times(_.random(1, MAX_GENERATED), () => generateInvalidField(type));
  assert.throws(() => {
    method._execute(mockUser, toInsert);
  }, `${_.capitalize(field)} must be of type ${type.name}`);
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
