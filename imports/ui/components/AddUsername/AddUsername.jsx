import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { debounce, kebabCase } from 'lodash';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500 } from 'material-ui/styles/colors';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import customFormValidator from '../../../modules/custom-form-validator';

if (Meteor.isClient) {
  import './AddUsername.scss';
};

const signupFormRules = {
  username: {
    required: true,
    maxLength: 22,
  },
};

const signupErrorMessages = {
  username: {
    required: "This field is required",
    maxLength: "Must be less than 22 characters",
  },
};

export default class AddUsername extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createUsername = debounce(this.createUsername.bind(this), 700);
    this.formValidate = this.formValidate.bind(this);
    this.editUsername = this.editUsername.bind(this);

    this.state = ({
      formErrors: {},
      username: '',
      usernameClean: '',
      userNameVerified: false,
      usernameLoading: false,
    });
  }

  createUsername(field) {
    const inputFieldToUse = (field === 'orgName') ? this.orgName.input.value : this.username.input.value;

      // put into username format
    const input = kebabCase(inputFieldToUse);
    let number = 0;

      // setting username functions
    const setUsernameTrue = (function (potentialUserName) {
      this.setState({ usernameClean: potentialUserName });
      this.setState({ username: potentialUserName });
      this.setState({ usernameLoading: false });
      this.setState({ userNameVerified: true });
    }).bind(this);

    const setUsernameFalse = (function (potentialUserName) {
      this.setState({ usernameClean: potentialUserName });
      this.setState({ username: potentialUserName });
      this.setState({ usernameLoading: false });
      this.setState({ userNameVerified: false });
      number += 1;
      checkUser(`${input}-${number}`);
    }).bind(this);

      // check if username exists already
    function checkUser(potentialUserName) {
      Meteor.call('users.checkUsername', { potentialUserName }, (error, count) => {
        if (error) {
          console.log(error.reason);
        } else {
          if (count > 0) {
            setUsernameFalse(potentialUserName);
            return false;
          }
          setUsernameTrue(potentialUserName);
          return true;
        }
      });
    }
    checkUser(input);
  }

  formValidate() {
    const input = {
      username: this.state.username,
    };

    const formErrors = customFormValidator(input, signupFormRules, signupErrorMessages);

    /*
    Check if formErrors is not false, username is verified and not loading.
    If empty and username is verified, submit form.
    */
    if (!formErrors &&
      this.state.userNameVerified === true &&
      this.state.usernameLoading === false) {
      this.handleSubmit();
    } else {
      this.setState({ formErrors });
    }
  }

  handleSubmit() {
    const { history } = this.props;

    const updateUsername = {
      username: this.state.username,
    };

    Meteor.call('users.addUsername', updateUsername, (error, res) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Thanks!', 'success');
      }
    });
  }

  editUsername() {
    this.setState({ username: this.username.input.value });
    this.createUsername('username');
    this.setState({ usernameLoading: true });
    this.setState({ "formErrors.username": "" });
  }

  render() {
    return (
      <div className="add-username">
        <Paper className="add-username-form">

          <h2>Please Choose A Username...</h2>

          <form onSubmit={event => event.preventDefault()}>

            <TextField
              name="orgID"
              floatingLabelText="Pick A Username"
              errorStyle={(this.state.formErrors.username) ? {} : { color: orange500 }}
              value={this.state.username}
              onChange={this.editUsername}
              ref={(input) => { this.username = input; }}
              errorText={(this.state.formErrors.username) ? this.state.formErrors.username : ''}
              maxLength="22"
            />

            {
            (this.state.usernameLoading)
            ? <RefreshIndicator
              size={25}
              left={10}
              top={0}
              status="loading"
              style={{ display: 'inline-block', position: 'relative' }}
            />
            : ''
          }

            <div>

              <RaisedButton
                type="submit"
                fullWidth
                onClick={this.formValidate}
                style={{ margin: "35px 0 35px 0" }}
              >
            Confirm
          </RaisedButton>

            </div>

          </form>
        </Paper>
      </div>
    );
  }
}
