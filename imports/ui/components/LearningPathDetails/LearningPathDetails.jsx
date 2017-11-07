import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
// import FontIcon from 'material-ui/FontIcon';
import { green500, red500 } from 'material-ui/styles/colors';
import { createContainer } from 'meteor/react-meteor-data';

import './LearningPathDetails.scss';

import { learningPathsUpvote, learningPathsDownvote, learningPathsGetVote } from '../../../api/LearningPath/methods';

const DESCRIPTION_LENGTH = 100;

class LearningPathDetails extends React.Component {
  constructor(props) {
    super(props);

    this.upvoteHandler = this.upvoteHandler.bind(this);
    this.downvoteHandler = this.downvoteHandler.bind(this);
  }

  upvoteHandler() {
    try {
      learningPathsUpvote.call({ _id: this.props._id });
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
      learningPathsDownvote.call({ _id: this.props._id });
    } catch (err) {
      Bert.alert({
        message: err.reason,
        type: 'alert',
        icon: 'fa-ban',
      });
    }
  }

  render() {
    const {
      _id,
      title,
      mentor,
      mentorName,
      description,
      thumbnail,
      aggregatedVotes,
      voteVal,
    } = this.props;

    return (
      <Card className="lp-details-container">
        <CardHeader className="lp-header">
          <CardMedia className="lp-media">
            <img className="lp-thumbnail" src={thumbnail} alt={title} />
          </CardMedia>
        </CardHeader>
        <Divider />
        <div className="lp-content">
          <div className="lp-title">
            <CardTitle
              className="lp-title-text"
              title={title}
              titleStyle={{ fontSize: '18px' }}
            />
            {/*
              TODO Uncomment this out when we have the savedLearningPaths field added to Users

              Meteor.user.savedLearningPaths &&
              Meteor.user.savedLearningPaths.indexOf(_id) !== -1 ?
                <FontIcon
                  className="fa fa-check-circle lp-user-subscribed-icon"
                  color={green500}
                /> :
                null
            */}
          </div>
          <CardText
            className="lp-description"
            // style={{ marginTop: '0px' }}
          >{
              description.length > DESCRIPTION_LENGTH ?
                `${description.slice(0, DESCRIPTION_LENGTH)}...` :
                description
            }</CardText>
          <CardActions className="lp-votes">
            <IconButton
              className="lp-vote-btn lp-upvote"
              tooltip="Upvote!"
              iconClassName="fa fa-thumbs-o-up"
              iconStyle={voteVal === 1 ?
                { color: green500 } :
                { color: null }
              }
              onClick={this.upvoteHandler}
            />
            <span className="lp-vote-count">{aggregatedVotes}</span>
            <IconButton
              className="lp-vote-btn lp-downvote"
              tooltip="Downvote..."
              iconClassName="fa fa-thumbs-o-down"
              iconStyle={voteVal === -1 ?
                { color: red500 } :
                { color: null }
              }
              onClick={this.downvoteHandler}
            />
          </CardActions>
          <div className="lp-mentor">
            <CardText className="lp-mentor-name">
              <Link to={`/users/${mentorName}`}>{mentorName}</Link>
            </CardText>
            {
              mentor === Meteor.userId ?
                <Link to={`/edit-path/${_id}`}>Edit</Link> :
                null
            }
          </div>
          <div className="clear" />
        </div>
      </Card>
    );
  }
}

LearningPathDetails.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  mentor: PropTypes.string.isRequired,
  mentorName: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  aggregatedVotes: PropTypes.number.isRequired,
  voteVal: PropTypes.number.isRequired,
};

export default createContainer(({ lp }) => {
  const { _id, title, mentor, mentorName, description, thumbnail, aggregatedVotes } = lp;

  const voteVal = learningPathsGetVote.call({ _id });

  return {
    _id,
    title,
    mentor,
    mentorName,
    description,
    thumbnail,
    aggregatedVotes,
    voteVal,
  };
}, LearningPathDetails);
