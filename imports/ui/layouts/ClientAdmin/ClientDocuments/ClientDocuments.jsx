import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { startCase, chunk } from 'lodash'

import {Tabs, Tab} from 'material-ui/Tabs';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import DocumentsCollection from '../../../../api/Documents/Documents';
import Loading from '../../../components/Loading/Loading.jsx';

import './ClientDocuments.scss';

const styles = {
  propContainer: {
    width: 200,
    overflow: 'hidden',
    margin: '20px auto 0',
  },
  propToggleHeader: {
    margin: '20px auto 10px',
  },
};

const handleRemove = (documentId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('documents.remove', {documentId}, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Document deleted!', 'success');
      }
    });
  }
};

class ClientDocuments extends React.Component {

  constructor(props) {
    super(props);

    this.state = ({
      })
  }

  render() {
    const { loading, documents, match, history } = this.props;

    return (!loading ? (
      <div className="Documents">

        <h1>Documents</h1>

        <div className="page-header clearfix">
          <Link className="btn btn-success pull-right" to={`/documents/new`}>+ Add Document</Link>
        </div>
        {documents.length ? <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Last Updated</th>
              <th>Created</th>
              <th />
              <th />
            </tr>
          </thead>
          <tbody>
            {documents.map(({ _id, title, createdAt, updatedAt }) => (
              <tr key={_id}>
                <td>{title}</td>
                <td>{timeago(updatedAt)}</td>
                <td>{monthDayYearAtTime(createdAt)}</td>
                <td>
                  <RaisedButton
                    onClick={() => history.push(`/documents/${_id}`)}
                  >View</RaisedButton>
                </td>
                <td>
                  <RaisedButton
                    onClick={() => handleRemove(_id)}
                  >Delete</RaisedButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table> : <p>ALERT No documents yet!</p>}
      </div>
    ) : <Loading />);
  }
}

ClientDocuments.propTypes = {
  loading: PropTypes.bool.isRequired,
  documents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('documents');
  return {
    loading: !subscription.ready(),
    documents: DocumentsCollection.find({ owner: Meteor.userId() }).fetch(),
  };
}, ClientDocuments);
