import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardHeader, CardMedia, CardTitle, CardActions, CardText } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import { createContainer } from 'meteor/react-meteor-data';

class LearningPathDetails extends React.Component {
  render() {
    const { _id, title, mentorName, description, thumbnail, aggregatedVotes } = this.props;
    return (
      <Card key={_id} className="learning-path-card">
        <div className="learning-path-details">
          <CardHeader className="lp-header">
            <CardMedia overlay={(<p>{description}</p>)}>
              <img className="learning-path-thumbnail" src={thumbnail} alt={title} />
            </CardMedia>
          </CardHeader>
          <div className="lp-content">
            <CardTitle title={title} />
            <CardActions>
              <IconButton tooltip="Upvote!">
                <FontIcon className="fa fa-thumbs-o-up" />
              </IconButton>
              <span className="lp-votes">{aggregatedVotes}</span>
              <IconButton tooltip="Downvote...">
                <FontIcon className="fa fa-thumbs-o-down" />
              </IconButton>
            </CardActions>
            {/* A link that points to the mentor's user page */}
            <CardText>{/* <a href="#"> */}{mentorName}{/* </a> */}</CardText>
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
