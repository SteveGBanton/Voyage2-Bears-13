import React from 'react';
import PropTypes from 'prop-types';
// import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

import Documents from '../../../../../api/Documents/Documents';
import NotFound from '../../../../components/NotFound/NotFound.jsx';
import Loading from '../../../../components/Loading/Loading';

import RaisedButton from 'material-ui/RaisedButton';

const handleRemove = (documentId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', {documentId}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
        history.push('/documents');
      }
    });
  }
};

const renderDocument = (doc, match, history, user) => (
  (doc)
    ? (
        <div className="ViewDocument">
          <RaisedButton
            onClick={() => history.push(`/documents/edit/${doc._id}`)}
            style={{margin: "10px"}}
          >
            Edit
          </RaisedButton>
          <RaisedButton
            onClick={() => handleRemove(doc._id, history)}
            className="text-danger"
            style={{margin: "10px"}}
          >
            Delete
          </RaisedButton>

          <p style={{fontSize: "10px", margin: "20px 0 5px 0"}}>viewing document</p>

          <h1>{ doc && doc.title }</h1>

          { doc && doc.body }

        </div>
      )
    : <NotFound />
);

const ClientViewDocument = ({ loading, doc, match, history, user }) => (
  !loading ? renderDocument(doc, match, history, user) : <Loading />
);

ClientViewDocument.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const documentId = match.params._id;
  const subscription = Meteor.subscribe('documents.view', documentId);

  return {
    loading: !subscription.ready(),
    doc: Documents.findOne(documentId),
  };
}, ClientViewDocument);
