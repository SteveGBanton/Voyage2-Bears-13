import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';

import RaisedButton from 'material-ui/RaisedButton';

import Loading from '../../../components/Loading/Loading';

/**

  A learning path document may or may not be passed into this Editor component.

  (The createPath component does not pass any document in, the editPath component does pass a document in)

  Example learning path document:

  CODEARCHBRANCH.

  const learningPath = {
 _id: 'geab4ah4a',
 ownerId: 'feagea3qg4sh4s', // creator of learning path
 name: '',
 description: '',
 resources: [
   {
     _id: 'hahsnsngearya4q',
     name: 'Resource 1',
     description: 'description of this resource, up to 200 chars long',
     url: 'http://example.com',
     longContent: 'More optional content, up to 5K characters long.',
     thumbnail: '',
   },
   {
     _id: 'h3afaghagearya4q',
     name: 'Resource 2',
     description: 'description of this resource, up to 200 chars long',
     url: 'http://example.com',
     longContent: 'More optional content, up to 5K characters long.',
     thumbnail: '',
   },
   {
     _id: 'ghh3aheargea3ya4q',
     name: 'Resource 3',
     description: 'description of this resource, up to 200 chars long',
     url: 'http://example.com',
     longContent: 'More optional content, up to 5K characters long.',
     thumbnail: '',
   },
   {
     _id: 'jbs4sbsgearya4q',
     name: 'Resource 4',
     description: 'description of this resource, up to 200 chars long',
     url: 'http://example.com',
     longContent: 'More optional content, up to 5K characters long.',
     thumbnail: '',
   },
 ]
}

*/

class LearningPathEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      resources = [],
      name = '',
      description = '',
    }
  }

  componentWillMount() {
    // If editing a document that already exists, load the document into state before component loads.

    this.setState({
      resources: this.props.doc.resources;
    })


  }
  render() {
    const { loading, doc, history, isUserOwner } = this.props;
    return (
        (!loading) ?
          <div className="create-path">

            {/* TODO
              Form To Add / Edit Paths

              Learning Path Name, description etc.

              IF EDITING A DOC:

                Current learning path resources are passed in as an array of objects.

                On

                a forEach function creates a form field for each of these, editable.

              Start by adding resource #1

              + button to add a new Resource

              Form validation to make sure everything is correct.

              Calls Meteor method to add to collection.

            */}

          </div>
          : ''
    );
  }
}

// TODO edit proptypes
CreatePath.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
