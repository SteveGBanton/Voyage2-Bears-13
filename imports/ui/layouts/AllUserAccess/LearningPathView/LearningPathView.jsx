import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';

import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import Loading from '../../../components/Loading/Loading';

import LearningPathCollection from '../../../../api/LearningPath/LearningPath';

if (Meteor.isClient) import './LearningPathView.scss';


// "_id": "HF7L4NSkTbuKg7Rgi",
//   "title": "Use Asana to track your team’s work & manage projects · Asana",
//     "description": "It’s free to use, simple to get started, and powerful enough to run your entire business. Sign up for free today.",
//       "url": "http://www.asana.com",
//         "thumbnail": "https://luna1.co/906e13.png",
//           "createdAt": "2017-11-13T16:08:58.353Z",
//             "updatedAt": "2017-11-13T21:52:31.310Z"
//     }
//   ],


const LearningPathView = ({ loading, learningPathDoc, history, user }) => (
  !loading ?
    <div className="learning-path-view-container">
      <div className="learning-path-view-one">
        <div className="title">
          <h1>{learningPathDoc.title}</h1>

          {(user && user.savedLearningPaths[learningPathDoc._id]) ?
            <div className="save-chip">
              <Chip
                onClick={() => Meteor.call('users.toggleSaveLearningPath', { learningPathId: learningPathDoc._id })}
                backgroundColor="#FFC0CB"
                labelColor="#424242"
              >
                <Avatar color="red" backgroundColor="#FFB6C1" icon={<FontIcon className="material-icons">favorite</FontIcon>} />
                Saved
              </Chip>
            </div>
            :
            <div className="save-chip">
            <Chip
              onClick={() => Meteor.call('users.toggleSaveLearningPath', { learningPathId: learningPathDoc._id })}
            >
              <Avatar color="#FFF" icon={<FontIcon className="material-icons">favorite</FontIcon>} />
              Save
            </Chip>
            </div>
          }
          {(user && learningPathDoc.mentor === user._id) ?
            <Chip
              onClick={() => history.push(`/learning-path/${learningPathDoc._id}/edit`)}
            >
              <Avatar color="#FFF" icon={<FontIcon className="material-icons">edit</FontIcon>} />
              Edit Path
            </Chip>
            :
            ''
          }
        </div>

        <Paper className="paper-box">
          <h3>Description:</h3>
          <p>{learningPathDoc.description}</p>
        </Paper>

        <Paper className="paper-box">
          <h3>Skills:</h3>
          <div className="skill-list" style={{ marginTop: 0 }}>
            {learningPathDoc.skills.map((skillItem, index) => (
              <Chip
                style={{ margin: 2 }}
                key={skillItem}
              >
                {skillItem}
              </Chip>
            ))}
          </div>
        </Paper>

        <Paper className="paper-box resources">
          {
            learningPathDoc.resources.map((resource, index) => (
              <div key={resource._id} className="resource-box">
                <div className="title-resource">
                  <div className="title-resource-number-title">
                    <div className="number-box">
                      <h5>{index + 1}</h5>
                    </div>
                    <h3>{resource.title}</h3>
                  </div>
                  <div><img width="50" src={resource.thumbnail} /></div>
                </div>
                <div className="description">{resource.description}</div>
                
                <div className="link-and-mark">
                  <a className="link" href={resource.url} target="_blank">
                    <Chip
                      style={{ cursor: 'pointer' }}
                      onClick={() => {}}
                    >
                      <Avatar color="#FFF" icon={<FontIcon className="material-icons">link</FontIcon>} />
                      Resource Link
                    </Chip>
                  
                  </a>
                  {(user && user.completedResources &&
                    user.completedResources[learningPathDoc._id] &&
                    user.completedResources[learningPathDoc._id][resource._id]) ?
                    <div className="save-chip">
                      <Chip
                        onClick={() => Meteor.call('users.toggleCompletedResource',
                          {
                            learningPathId: learningPathDoc._id,
                            resourceId: resource._id,
                          }, (err, res) => {
                            if (err) console.log(err)
                          })
                        }
                        backgroundColor="#5cb85c"
                        labelColor="#FFF"
                      >
                        <Avatar
                          color="#fff"
                          backgroundColor="#5cb85c"
                          icon={
                            <FontIcon
                              className="material-icons"
                            >
                              check_circle
                          </FontIcon>
                          }
                        />
                        Completed
                    </Chip>
                    </div>
                    :
                    user ? 
                      <div className="save-chip">
                        <Chip
                          onClick={() => Meteor.call('users.toggleCompletedResource',
                            {
                              learningPathId: learningPathDoc._id,
                              resourceId: resource._id,
                            }, (err, res) => {
                              if (err) console.log(err)
                            })
                          }
                        >
                          <Avatar
                            color="#FFF"
                            icon={
                              <FontIcon
                                className="material-icons"
                              >
                                check
                            </FontIcon>
                            }
                          />
                          Mark Complete
                      </Chip>
                      </div>
                      :
                      ''
                  }
                </div>
                
                {((index + 1) !== learningPathDoc.resources.length) ?
                  <Divider style={{ marginTop: 50, width: '100%' }} /> 
                  :
                  ''
                }
              </div>
            ))
          }
        </Paper>
      </div>
    </div>
  : <Loading />
);

// TODO edit proptypes
LearningPathView.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match, user }) => {

  const learningPathId = match.params.learningPathId;
  const subscription = Meteor.subscribe('learning-paths.view', learningPathId);
  const learningPathDoc = LearningPathCollection.findOne(learningPathId);

  return {
    loading: !subscription.ready(),
    learningPathDoc,
    user,
  };
}, LearningPathView);
