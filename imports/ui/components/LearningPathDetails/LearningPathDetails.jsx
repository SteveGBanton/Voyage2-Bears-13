import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import FontIcon from 'material-ui/FontIcon';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import { green500, red500 } from 'material-ui/styles/colors';
import Avatar from 'material-ui/Avatar';

import { learningPathsUpvote, learningPathsDownvote } from '../../../api/LearningPath/methods';

if (Meteor.isClient) import './LearningPathDetails.scss';

// We should proobably have a default image hosted in the S3
export const DEFAULT_THUMBNAIL = 'https://preview.ibb.co/ixzQ8R/gears.jpg';

export default class LearningPathDetails extends React.Component {
  constructor(props) {
    super(props);
    this.upvoteHandler = this.upvoteHandler.bind(this);
    this.downvoteHandler = this.downvoteHandler.bind(this);
  }

  upvoteHandler() {
    try {
      const { _id } = this.props.lp;
      learningPathsUpvote.call({ _id });
    } catch (err) {
      Bert.alert({
        message: err.reason,
        type: 'alert',
        icon: 'fa-ban',
      });
    }
  }

  downvoteHandler() {
    try {
      const { _id } = this.props.lp;
      learningPathsDownvote.call({ _id });
    } catch (err) {
      Bert.alert({
        message: err.reason,
        type: 'alert',
        icon: 'fa-ban',
      });
    }
  }

  renderSkills() {
    const { skills } = this.props.lp;
    return skills.map((skill, i) => (
      <Chip className="lp-skill" key={`skill-${i + 1}`} style={{ margin: 3 }}>
        {skill}
      </Chip>
      ),
    );
  }

  render() {
    const {
      _id,
      title,
      mentor,
      mentorName,
      thumbnail,
      aggregatedVotes,
      voted,
      resources
    } = this.props.lp;
    const { user, userId } = this.props;

    return (
      <Card className="lp-details-container">
        <div
          className="lp-header-media"
          style={{ backgroundImage: `url(${thumbnail ? thumbnail : (resources[0] && resources[0].thumbnail) ? resources[0].thumbnail : DEFAULT_THUMBNAIL})` }}
          alt={title}
        >
          {(user && user.savedLearningPaths && user.savedLearningPaths[_id]) ?
              <Chip
                onClick={() => Meteor.call('users.toggleSaveLearningPath', { learningPathId: _id })}
                backgroundColor="#FFC0CB"
                labelColor="#424242"
                className="save-chip"
              >
                <Avatar color="red" backgroundColor="#FFB6C1" icon={<FontIcon className="material-icons">favorite</FontIcon>} />
                Saved
              </Chip>
            :
            user ?
              <Chip
                onClick={() => Meteor.call('users.toggleSaveLearningPath', { learningPathId: _id })}
                className="save-chip"
              >
                <Avatar color="#FFF" icon={<FontIcon className="material-icons">favorite</FontIcon>} />
                Save
              </Chip>
              :
              ''
          }
        </div>
          <Divider />
          <div className="lp-title">
            <Link to={`/learning-path/${_id}`}>
              <CardTitle
                className="lp-title-text"
                title={title}
                titleStyle={{ fontSize: '18px', color: '#009688' }}
              />
            </Link>
            <div className="lp-skills">
              {this.renderSkills()}
            </div>
            <Divider />
          </div>
        <div className="lp-content">
          <CardActions className="lp-votes">
            <IconButton
              className="lp-vote-btn lp-upvote"
              tooltip="Upvote!"
              iconClassName="fa fa-chevron-up"
              iconStyle={voted[userId] === 1 ?
                { color: green500 } :
                { color: null }
              }
              onClick={this.upvoteHandler}
            />
            <span className="lp-vote-count">{aggregatedVotes}</span>
            <IconButton
              className="lp-vote-btn lp-downvote"
              tooltip="Downvote..."
              iconClassName="fa fa-chevron-down"
              iconStyle={voted[userId] === -1 ?
                { color: red500 } :
                { color: null }
              }
              onClick={this.downvoteHandler}
            />
          </CardActions>
          <div className="lp-mentor">
            <CardText className="lp-mentor-name">
              by <Link to={`/user/${mentorName}`}>{mentorName}</Link>
              {
                mentor === userId ?
                  <span> | <Link className="lp-edit-link" to={`/learning-path/${_id}/edit`}>edit</Link></span> :
                  null
              }
            </CardText>
          </div>
          <div className="clear" />
        </div>
      </Card>
    );
  }
}

LearningPathDetails.defaultProps = {
  user: null,
  userId: null,
}

LearningPathDetails.propTypes = {
  lp: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    mentor: PropTypes.string.isRequired,
    mentorName: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    thumbnail: PropTypes.string,
    aggregatedVotes: PropTypes.number.isRequired,
    voted: PropTypes.shape({}).isRequired,
  }).isRequired,
  user: PropTypes.shape({}),
  userId: PropTypes.string,
};
