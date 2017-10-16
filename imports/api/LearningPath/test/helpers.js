import { Random } from 'meteor/random';
import { faker } from 'meteor/practicalmeteor:faker';
import { assert } from 'meteor/practicalmeteor:chai';
import sinon from 'sinon';
import _ from 'lodash';

import LearningPaths from '../LearningPath';
import { learningPathsInsert, learningPathsUpdate, learningPathsRemove } from '../methods';


// Method helpers

const MAX_GENERATED = 10;

const mockUser = { userId: Random.id() };

function generateSkills(opts = { min: NaN, max: NaN }) {
  const SKILLS = ['JavaScript', 'Ruby', 'HTML5', 'React', 'Git'];
  return _.times(_.random(
    opts.min ? opts.min : 1,
    opts.max ? opts.max : MAX_GENERATED), _.sample(SKILLS));
}

function generateSingleResource() {
  return {
    title: 'Testing Resource Title',
    description: 'Here is a description of the resource',
    url: `https://fakeurl.com/${Random.id()}`,
    thumbnail: `https://fakeurl.com/${Random.id()}.jpg`,
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
  if (type === Object) _.pull(DATA_TYPES, Array); // Since Arrays are Objects

  return _.sample(DATA_TYPES.filter(elem => elem !== type))();
}

function generateData(opts = { includeId: false, includeMentor: false }) {
  const data = {
    title: 'Testing Learning Path Title',
    description: 'Here is a description of the learning path',
    skills: generateSkills(),
    resources: generateResources(),
  };
  if (opts.includeId) data._id = Random.id();
  if (opts.includeMentor) data.mentor = mockUser.userId;

  return data;
}

function capitalizeField(field) {
  return field !== '_id' ? _.capitalize(field) : 'ID';
}

function generateRandomLengthString(len) {
  // Range of letters in ASCII map from codes 65 to 90 (uppercase)
  // And codes 96 to 122
  const LETTERS = [
    ..._.map(_.range(65, 91), code => String.fromCharCode(code)),
    ..._.map(_.range(96, 122), code => String.fromCharCode(code)),
  ];

  return _.join(
    _.times(
      _.random(
        _.max(0, len - 1),
      ),
      _.sample(LETTERS),
    ),
  );
}

function generateInvalidArray(type) {
  return _.times(
    _.random(1, MAX_GENERATED), () => generateInvalidField(type),
  );
}

export function checkCalledInsert(sandbox, stub) {
  const toInsert = generateData();
  const expectedObj = { mentor: mockUser.userId, ...toInsert };
  learningPathsInsert._execute(mockUser, toInsert);
  sandbox.assert.calledWith(stub, expectedObj);
}

export function checkCalledUpdate(sandbox, stub) {
  const toUpdate = generateData({ includeId: true });
  const expectedId = { _id: toUpdate._id };
  const expectedObj = { $set: _.omit(toUpdate, '_id') };
  learningPathsUpdate._execute(mockUser, toUpdate);
  sandbox.assert.calledWith(stub, expectedId, expectedObj);
}

export function checkCalledRemove(sandbox, stub) {
  const toRemove = { _id: Random.id() };
  learningPathsRemove._execute(mockUser, toRemove);
  sandbox.assert.calledWith(stub, toRemove);
}

export function checkUpdateReturnId() {
  const toUpdate = generateData({ includeId: true });
  const expectedId = toUpdate._id;
  const actualId = learningPathsUpdate._execute(mockUser, toUpdate);
  assert.equal(actualId, expectedId);
}

export function checkOmittedFieldError(field, method, opts = { isRemoveMethod: false }) {
  const toInsert = !opts.isRemoveMethod ? { ..._.omit(generateData(opts), [field]) } : {};
  assert.throws(() => {
    method(mockUser, toInsert);
  }, `${capitalizeField(field)} is required`);
}

export function checkInvalidTypeError(field, type, method, opts = { isRemoveMethod: false }) {
  const toInsert = !opts.isRemoveMethod ? generateData(opts) : {};
  toInsert[field] = generateInvalidField(type);
  assert.throws(() => {
    method(mockUser, toInsert);
  }, `${capitalizeField(field)} must be of type ${type.name}`);
}

export function checkInvalidIdError(method, opts = { isRemoveMethod: false }) {
  const toInsert = !opts.isRemoveMethod ? generateData(opts) : {};
  toInsert._id = 'hello world';
  assert.throws(() => {
    method(mockUser, toInsert);
  }, 'ID must be a valid alphanumeric ID');
}

export function checkBelowLenStrError(field, len, method, opts) {
  const toInsert = generateData(opts);
  toInsert[field] = generateRandomLengthString(len);
  assert.throws(() => {
    method(mockUser, toInsert);
  }, `${capitalizeField(field)} must be at least ${len} characters`);
}

export function checkEmptySkillArrayError(method, opts) {
  const toInsert = generateData(opts);
  toInsert.skills = [];
  assert.throws(() => {
    method(mockUser, toInsert);
  }, 'You must specify at least 1 values');
}

export function checkEmptyResourceArrayError(method, opts) {
  const toInsert = generateData(opts);
  toInsert.skills = [];
  assert.throws(() => {
    method(mockUser, toInsert);
  }, 'You must specify at least 1 values');
}

export function checkInvalidArrayElemsError(field, type, method, opts = { excludeUser: false }) {
  const toInsert = generateData(opts);
  toInsert[field] = generateInvalidArray(type);
  assert.throws(() => {
    method(mockUser, toInsert);
  }, `${capitalizeField(field)} must be of type ${type.name}`);
}

function getSchemaContextAndValidate() {
  const schema = LearningPaths.schema;
  const lpContext = schema.namedContext('testing');
  const validate = lpContext.validate.bind(lpContext);

  return [schema, lpContext, validate];
}

function getCleanedLearningPath(opts = { context: null, lp: null }) {
  const [schema] = opts.context ? [opts.context] : getSchemaContextAndValidate();
  return schema.clean(opts.lp ?
    opts.lp :
    generateData({ includeMentor: true }),
  );
}

// Schema test helpers

export function validateOmittedField(field) {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  assert.isFalse(validate({ ..._.omit(lp, field) }));
}

export function validateInvalidField(field, type) {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  lp[field] = generateInvalidField(type);
  assert.isFalse(validate(lp));
}

export function validateUnderMinStr(field, len) {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  lp[field] = generateRandomLengthString(len);
  assert.isFalse(validate(lp));
}

export function validateInvalidMentorId() {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  lp.mentor = 'hello world';
  assert.isFalse(validate(lp));
}

export function validateEmptyArray(field) {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  lp[field] = [];
  assert.isFalse(validate(lp));
}

export function validateInvalidArrayElems(field, type) {
  const [, context, validate] = getSchemaContextAndValidate();
  const lp = getCleanedLearningPath(context);
  lp[field] = generateInvalidArray(type);
  assert.isFalse(validate(lp));
}

// Use offsets to get an approximation of the current time
function getCurrentTimeRange() {
  const TWO_SECONDS = 2000;

  const now = new Date();
  const earlierMs = now.getTime() - TWO_SECONDS;
  const laterMs = now.getTime() + TWO_SECONDS;
  return [new Date(earlierMs).toISOString(), new Date(laterMs).toISOString()];
}

function isWithinTimeRange(now, earlier, later) {
  return now >= earlier && now <= later;
}

function getCleanedDates(field) {
  const FIVE_SECONDS = 5000;
  const clock = sinon.useFakeTimers();
  const [, context] = getSchemaContextAndValidate();
  let lp = getCleanedLearningPath({ context });

  const expectedDate = lp[field];
  clock.tick(FIVE_SECONDS); // 5 seconds into the future
  lp = getCleanedLearningPath({ context, lp });
  const actualDate = lp[field];

  clock.restore();

  return [actualDate, expectedDate];
}

export function validateValidDate(field) {
  const ISO_FORMAT = /\d+-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/;

  const lp = getCleanedLearningPath();
  assert.match(lp[field], ISO_FORMAT);
}

export function validateCurrentDate(field) {
  const lp = getCleanedLearningPath();
  const [earlier, later] = getCurrentTimeRange();
  assert.isTrue(isWithinTimeRange(lp[field], earlier, later));
}

export function validateCleanedDates(field, assertMethod) {
  const [actualDate, expectedDate] = getCleanedDates(field);
  assertMethod(actualDate, expectedDate);
}
