import React from 'react';
import { Random } from 'meteor/random';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { MemoryRouter } from 'react-router-dom';
import _ from 'lodash';

function generateUniqueId(usedId) {
  let newId;
  do {
    newId = Random.id();
  } while (newId === usedId);

  return newId;
}

export function generateLearningPathData(userId, isOwner, customLp = {}) {
  const resourceId1 = Random.id();
  const resourceId2 = generateUniqueId(resourceId1);

  return {
    _id: _.has(customLp, '_id') ? customLp._id : Random.id(),
    title: _.has(customLp, 'title') ? customLp.title : 'Test Title',
    description: _.has(customLp, 'description') ? customLp.description : 'This is a description',
    mentor: isOwner ? userId : generateUniqueId(userId),
    mentorName: _.has(customLp, 'mentorName') ? customLp.mentorName : 'JohnDoe',
    thumbnail: _.has(customLp, 'thumbnail') ? customLp.thumbnail : 'https://cdn.pixabay.com/photo/2017/11/09/16/16/man-2933984__340.jpg',
    aggregatedVotes: _.has(customLp, 'aggregatedVotes') ? customLp.aggregatedVotes : 0,
    voted: _.has(customLp, 'voted') ? customLp.voted : {},
    skills: _.has(customLp, 'skills') ? customLp.skills : ['js', 'css', 'react-js'],
    resources: _.has(customLp, 'resources') ? customLp.resources : [
      {
        _id: resourceId1,
        title: 'Test Resource Title1',
        description: 'Another description',
        thumbnail: 'https://cdn.pixabay.com/photo/2017/11/07/00/18/guitar-2925274__340.jpg',
        url: 'https://fakeurl.com/1',
      },
      {
        _id: resourceId2,
        title: 'Test Resource Title2',
        description: 'Yet another description',
        thumbnail: 'https://cdn.pixabay.com/photo/2017/06/27/05/33/shanghai-2446326__340.jpg',
        url: 'https://fakeurl.com/1',
      },
    ],
  };
}

export function generateLearningPathDataList(userId) {
  const MAX_GENERATE = 9;
  return _.times(_.random(1, MAX_GENERATE), () => generateLearningPathData(userId, false));
}

export function getTestDoc(component) {
  return (
    <MuiThemeProvider>
      <MemoryRouter initialEntries={['/']}>
        {component}
      </MemoryRouter>
    </MuiThemeProvider>
  );
}
