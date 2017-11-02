import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { green500, red500 } from 'material-ui/styles/colors';
import { createContainer } from 'meteor/react-meteor-data';

import './LearningPathDetails.scss';

const DESCRIPTION_LENGTH = 100;

class LearningPathDetails extends React.Component {
  render() {
    const { _id, title, mentorName, description, thumbnail, aggregatedVotes } = this.props;
    return (
      <Card key={_id} className="lp-details">
        <div className="lp-container">
          <CardHeader className="lp-header">
            <CardMedia className="lp-media">
              <img className="lp-thumbnail" src={thumbnail} alt={title} />
            </CardMedia>
          </CardHeader>
          <Divider />
          <div className="lp-content">
            <CardTitle className="lp-title" title={title} />
            <CardText className="lp-description">{
              description.length > DESCRIPTION_LENGTH ?
                `${description.slice(0, DESCRIPTION_LENGTH)}...` :
                description
            }</CardText>
            <CardActions className="lp-votes">
              <IconButton
                className="lp-vote-btn lp-upvote"
                tooltip="Upvote!"
                iconClassName="fa fa-thumbs-o-up"
                iconStyle={{
                  iconHoverColor: green500,
                }}
              />
              <span className="lp-vote-count">{aggregatedVotes}</span>
              <IconButton
                className="lp-vote-btn lp-downvote"
                tooltip="Downvote..."
                iconClassName="fa fa-thumbs-o-down"
                iconStyle={{
                  iconHoverColor: red500,
                }}
              />
            </CardActions>
            {/* A link that points to the mentor's user page */}
            <div className="lp-mentor">
              <CardText className="lp-mentor-name">
                {/* <a href="#"> */}{mentorName}{/* </a> */}
              </CardText>
            </div>
            <div className="clear" />
          </div>
        </div>
      </Card>
    );
  }
}

export default createContainer(({ lp }) => {
  const { _id, title, mentor, description, thumbnail, aggregatedVotes } = lp;

  Meteor.subscribe('users.getMentorName', mentor);

  // const mentorInstance = Meteor.users.find({}).fetch()[0];
  const mentorInstance = { username: 'John Doe' };

  return {
    _id,
    title,
    mentorName: mentorInstance.username,
    description,
    thumbnail,
    aggregatedVotes,
  };
}, LearningPathDetails);
