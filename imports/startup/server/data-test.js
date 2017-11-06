import { Random } from 'meteor/random';
import faker from 'faker';
import _ from 'lodash';

import LearningPaths, {
  MAX_SKILLS,
  MAX_RESOURCES,
  MIN_TITLE_LENGTH,
  MAX_TITLE_LENGTH,
} from '../../api/LearningPath/LearningPath';

function generateTitle() {
  let title;
  do {
    title = faker.lorem.words();
  } while (title.length < MIN_TITLE_LENGTH || title.length > MAX_TITLE_LENGTH);

  return title;
}

function generateSkills() {
  return _.times(_.random(1, MAX_SKILLS), () =>
    _.head(faker.lorem.words().split(' ')),
  );
}

function generateResources() {
  return _.times(_.random(1, MAX_RESOURCES), () => {
    return {
      _id: Random.id(),
      title: generateTitle(),
      description: faker.lorem.paragraphs(),
      url: `https://fakeurl.com/${Random.id()}`,
      thumbnail: faker.image.image(),
    };
  });
}

Meteor.startup(() => {
  LearningPaths.remove({});
  if (LearningPaths.find({}).count() === 0) {
    const COLLECTION_NUMBER = 9;
    _.times(COLLECTION_NUMBER, () => {
      LearningPaths.insert({
        title: generateTitle(),
        description: faker.lorem.paragraphs(),
        mentor: Random.id(),
        thumbnail: faker.image.image(),
        aggregatedVotes: 0,
        voted: {},
        skills: generateSkills(),
        resources: generateResources(),
      });
    });
  }
});
