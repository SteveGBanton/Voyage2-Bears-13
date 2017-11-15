import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import { debounce, kebabCase } from 'lodash';

import RefreshIndicator from 'material-ui/RefreshIndicator';
import customFormValidator from '../../../../modules/custom-form-validator';

// material-ui
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';
import { orange500 } from 'material-ui/styles/colors';

const signupFormRules = {
  emailAddress: {
    required: true,
    maxLength: 40,
    email: true,
  },
  username: {
    required: true,
    maxLength: 22,
  },
  password: {
    required: true,
    password: true,
  },
};

const signupErrorMessages = {
  emailAddress: {
    required: "This field is required",
    email: "Please enter a valid email",
  },
  username: {
    required: "This field is required",
  },
  password: {
    required: "This field is required",
    password: "Keep your account safe: at least 9 characters required, at least one uppercase letter and one number. Special characters allowed: $%@#£€*?&",
  },
};

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.createUsername = debounce(this.createUsername.bind(this), 700);
    this.formValidate = this.formValidate.bind(this);
    this.editUsername = this.editUsername.bind(this);
    this.editUsernameWithOrgName = this.editUsernameWithOrgName.bind(this);

    this.state = ({
      formErrors: {},
      username: "",
      usernameClean: "",
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

      // check if exists already
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
      emailAddress: this.emailAddress.input.value,
      password: this.password.input.value,
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

    const newAdmin = {
      email: this.emailAddress.input.value,
      password: this.password.input.value,
      username: this.state.username,
    };

    Meteor.call('users.createNewUser', newAdmin, (error, res) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
        console.log(error);
      } else {
        Meteor.loginWithPassword(
          this.emailAddress.input.value,
          this.password.input.value,
          (loginError) => {
            if (loginError) {
              Bert.alert('Error Logging In', 'danger');
            } else {
              Meteor.call('users.sendVerificationEmail');
              Bert.alert('Welcome!', 'success');
              history.push(`/create-path`);
            }
          });
      }
    });
  }

  editUsername() {
    this.setState({ username: this.username.input.value });
    this.createUsername('username');
    this.setState({ usernameLoading: true });
    this.setState({ "formErrors.username": "" });
  }

  editUsernameWithOrgName() {
    this.createUsername('orgName');
    this.setState({ usernameLoading: true });
    this.setState({ "formErrors.username": "" });
  }

  signUpFacebook() {
    Meteor.loginWithFacebook({
      requestPermissions: ['public_profile', 'email'],
    }, (err) => {
      if (err) {
        console.log(err);
        // handle error
      } else {
        console.log();
        // successful login!
      }
    });
  }

  signUpGoogle() {
    Meteor.loginWithGoogle({
      requestPermissions: ['email'],
    }, (err) => {
      if (err) {
        console.log(err);
        // handle error
      } else {
        console.log(Meteor.user());
        // successful login!
      }
    });
  }

  render() {
    return (
      <Paper className="Signup">

        <h2>Create New Account</h2>

        <form onSubmit={event => event.preventDefault()}>

          <RaisedButton
            type="submit"
            fullWidth
            onClick={this.signUpFacebook}
            style={{ margin: '10px 0 0 0' }}
            backgroundColor="#3b5998"
          >
            <span style={{ color: 'white' }}>
            Facebook Sign Up
          </span>
          </RaisedButton>

          <RaisedButton
            type="submit"
            fullWidth
            onClick={this.signUpGoogle}
            style={{ margin: '10px 0 0 0' }}
            backgroundColor="#EA4335"
          >
            <span style={{ color: 'white' }}>Google Sign Up</span>
          </RaisedButton>

          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexFlow: 'row nowrap', marginTop: 20 }}>
            <FontIcon className="material-icons">
              remove
            </FontIcon>
            OR
            <FontIcon className="material-icons">
              remove
            </FontIcon>
          </div>

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

          <TextField
            name="username"
            floatingLabelText="Email Address"
            ref={(input) => { this.emailAddress = input; }}
            errorText={this.state.formErrors.emailAddress}
          /><br />

          <TextField
            name="password"
            type="password"
            floatingLabelText="Password"
            ref={(password) => { this.password = password; }}
            errorText={this.state.formErrors.password}
          />

          <div>

            <RaisedButton
              type="submit"
              fullWidth
              onClick={this.formValidate}
              style={{ margin: "35px 0 35px 0" }}
            >
          Sign Up
        </RaisedButton>

          </div>

          <p>Already have an account? <Link to="/login">Log In</Link>.</p>

        </form>
      </Paper>);
  }
}

Signup.propTypes = {
  history: PropTypes.object.isRequired,
};
